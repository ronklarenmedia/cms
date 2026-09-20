"use server";

import { and, asc, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { siteDomains, sites } from "@/db/schema";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/site-domains";
import { MAX_DOMAINS_PER_SITE, previewHost, validateCustomHostname } from "@/lib/site-hosts";
import * as vercel from "@/lib/vercel-domains";
import type { DomainDetail } from "@/lib/vercel-domains";
import type { Result } from "./actions";

const uuid = z.uuid();
const NO_SITE = "Deze website bestaat niet meer.";
const NO_DOMAIN = "Dit domein bestaat niet (meer).";

export type DomainItem = {
  id: string;
  hostname: string;
  isPrimary: boolean;
  status: "pending" | "active";
  /** De stand bij Vercel (DNS-records, TXT-challenge); null als die niet is opgehaald of Vercel niet gekoppeld is. */
  detail: DomainDetail | null;
  /** Waarom `detail` ontbreekt (bijv. Vercel niet bereikbaar). */
  note: string | null;
};

export type DomainsInfo = {
  /** Is de koppeling met Vercel ingesteld? Zo niet, dan worden domeinen alleen opgeslagen. */
  providerConfigured: boolean;
  previewHost: string | null;
  maxDomains: number;
  domains: DomainItem[];
};

const isUniqueViolation = (e: unknown): e is { constraint?: string } =>
  typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "23505";

async function loadSite(siteId: string) {
  if (!uuid.safeParse(siteId).success) return null;
  const [site] = await db.select({ id: sites.id, slug: sites.slug }).from(sites).where(eq(sites.id, siteId));
  return site ?? null;
}

/** De domeinen van een site. Met `refresh` wordt per domein de stand bij Vercel opgehaald (en `verify`: eerst het eigendom proberen te bevestigen). */
async function buildInfo(site: { id: string; slug: string }, { refresh = false, verify = false } = {}): Promise<DomainsInfo> {
  const rows = await db.select().from(siteDomains).where(eq(siteDomains.siteId, site.id)).orderBy(asc(siteDomains.createdAt));
  const configured = vercel.isVercelConfigured();

  const domains = await Promise.all(
    rows.map(async (row): Promise<DomainItem> => {
      let status = row.status;
      let detail: DomainDetail | null = null;
      let note: string | null = null;
      if (refresh && configured) {
        const res = await vercel.domainStatus(row.hostname, { verify: verify && row.status === "pending" });
        if (res.ok) {
          detail = res.value;
          const next = res.value.active ? "active" : "pending";
          if (next !== row.status) {
            status = next;
            await db.update(siteDomains).set({ status: next, verifiedAt: next === "active" ? new Date() : null }).where(eq(siteDomains.id, row.id));
          }
        } else {
          note = res.error;
        }
      }
      return { id: row.id, hostname: row.hostname, isPrimary: row.isPrimary, status, detail, note };
    }),
  );

  // Wisselde er een status, dan verandert mogelijk het doel van de doorverwijzing: de cache van deze site opnieuw opbouwen.
  if (domains.some((d, i) => d.status !== rows[i].status)) await revalidatePublicSite(site);
  return { providerConfigured: configured, previewHost: previewHost(site.slug), maxDomains: MAX_DOMAINS_PER_SITE, domains };
}

export async function getSiteDomains(siteId: string, options: { refresh?: boolean; verify?: boolean } = {}): Promise<Result<{ info: DomainsInfo }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  const site = await loadSite(siteId);
  if (!site) return { ok: false, error: NO_SITE };
  return { ok: true, info: await buildInfo(site, options) };
}

/** Voegt een eigen domein toe aan een site en meldt het aan bij Vercel. Het eerste domein van een site wordt het primaire. */
export async function addSiteDomain(siteId: string, input: string): Promise<Result<{ info: DomainsInfo }>> {
  const current = await staffUser();
  if (!current) return { ok: false, error: NOT_LOGGED_IN };
  const site = await loadSite(siteId);
  if (!site) return { ok: false, error: NO_SITE };

  const parsed = validateCustomHostname(input);
  if (!parsed.ok) return parsed;
  const { hostname } = parsed;

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(siteDomains).where(eq(siteDomains.siteId, siteId));
  if (count >= MAX_DOMAINS_PER_SITE) return { ok: false, error: `Een website kan maximaal ${MAX_DOMAINS_PER_SITE} eigen domeinen hebben.` };

  const insert = (isPrimary: boolean) =>
    db.insert(siteDomains).values({ siteId, hostname, isPrimary, createdBy: current.id }).returning({ id: siteDomains.id });
  const noPrimaryYet = count === 0 || (await db.select({ id: siteDomains.id }).from(siteDomains).where(and(eq(siteDomains.siteId, siteId), eq(siteDomains.isPrimary, true)))).length === 0;
  let created: { id: string } | undefined;
  try {
    [created] = await insert(noPrimaryYet);
  } catch (e) {
    if (!isUniqueViolation(e)) throw e;
    if (e.constraint === "site_domains_one_primary_idx") {
      // Een gelijktijdige toevoeging werd net primair: dit domein wordt een gewoon domein.
      try {
        [created] = await insert(false);
      } catch (e2) {
        if (!isUniqueViolation(e2)) throw e2;
      }
    }
    if (!created) return { ok: false, error: "Dit domein is al aan een website gekoppeld." };
  }

  if (vercel.isVercelConfigured()) {
    const res = await vercel.addDomain(hostname);
    if (!res.ok) {
      // Zonder aanmelding bij Vercel kan het domein niet werken: liever geen half domein laten staan.
      await db.delete(siteDomains).where(eq(siteDomains.id, created.id));
      return { ok: false, error: res.error };
    }
    if (res.value.active) await db.update(siteDomains).set({ status: "active", verifiedAt: new Date() }).where(eq(siteDomains.id, created.id));
  }

  await revalidatePublicSite(site);
  return { ok: true, info: await buildInfo(site, { refresh: true }) };
}

/** Maakt een domein het primaire: bezoekers via een ander adres van deze site worden daarheen gestuurd. */
export async function makeDomainPrimary(siteId: string, domainId: string): Promise<Result<{ info: DomainsInfo }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  const site = await loadSite(siteId);
  if (!site || !uuid.safeParse(domainId).success) return { ok: false, error: site ? NO_DOMAIN : NO_SITE };

  const found = await db.transaction(async (tx) => {
    const [row] = await tx.select({ id: siteDomains.id }).from(siteDomains).where(and(eq(siteDomains.id, domainId), eq(siteDomains.siteId, siteId)));
    if (!row) return false;
    // Eerst de andere weghalen: er mag per site maar één primair domein bestaan.
    await tx.update(siteDomains).set({ isPrimary: false }).where(and(eq(siteDomains.siteId, siteId), ne(siteDomains.id, domainId)));
    await tx.update(siteDomains).set({ isPrimary: true }).where(eq(siteDomains.id, domainId));
    return true;
  });
  if (!found) return { ok: false, error: NO_DOMAIN };
  await revalidatePublicSite(site);
  return { ok: true, info: await buildInfo(site) };
}

/** Haalt een domein weg bij de site en bij Vercel. Alleen een platform-admin (het domein van een klant staat live). */
export async function removeSiteDomain(siteId: string, domainId: string): Promise<Result<{ info: DomainsInfo }>> {
  const current = await staffUser();
  if (!current) return { ok: false, error: NOT_LOGGED_IN };
  if (current.role !== "platform-admin") return { ok: false, error: "Alleen een platform-admin mag een domein verwijderen." };
  const site = await loadSite(siteId);
  if (!site || !uuid.safeParse(domainId).success) return { ok: false, error: site ? NO_DOMAIN : NO_SITE };

  const [row] = await db.select().from(siteDomains).where(and(eq(siteDomains.id, domainId), eq(siteDomains.siteId, siteId)));
  if (!row) return { ok: false, error: NO_DOMAIN };

  const res = await vercel.removeDomain(row.hostname);
  if (!res.ok) return { ok: false, error: res.error };

  await db.transaction(async (tx) => {
    await tx.delete(siteDomains).where(eq(siteDomains.id, domainId));
    if (row.isPrimary) {
      // Het primaire domein viel weg: een ander domein van deze site neemt die rol over (bij voorkeur een actief domein).
      const [next] = await tx.select({ id: siteDomains.id }).from(siteDomains).where(eq(siteDomains.siteId, siteId)).orderBy(sql`${siteDomains.status} = 'active' desc`, asc(siteDomains.createdAt)).limit(1);
      if (next) await tx.update(siteDomains).set({ isPrimary: true }).where(eq(siteDomains.id, next.id));
    }
  });
  await revalidatePublicSite(site, [row.hostname]);
  return { ok: true, info: await buildInfo(site) };
}
