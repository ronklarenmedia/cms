"use server";

import { and, desc, eq, lt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { sites, siteVersions, user } from "@/db/schema";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import { hostsOfSite } from "@/lib/site-hosts";
import type { Result } from "./actions";
import { getPublishInfo, KEEP_VERSIONS, loadWorkingSnapshot, type PublishInfo } from "./publishing";

const uuid = z.uuid();
const NO_SITE = "Deze website bestaat niet meer.";

/** De openbare pagina's van een site opnieuw laten opbouwen bij het volgende bezoek. */
function revalidatePublic(site: { slug: string }) {
  for (const host of hostsOfSite(site)) revalidatePath(`/s/${encodeURIComponent(host)}`, "layout");
  revalidatePath("/websites");
}

/** Publiceert de werkkopie als nieuwe versie. Is er niets gewijzigd sinds de live versie, dan verandert er niets. */
export async function publishSite(siteId: string, note?: string): Promise<Result<{ version: number; unchanged: boolean }>> {
  const current = await staffUser();
  if (!current) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success) return { ok: false, error: NO_SITE };

  const working = await loadWorkingSnapshot(siteId);
  if (!working.ok) return { ok: false, error: `Niet gepubliceerd: ${working.error}` };
  const cleanNote = note?.trim().slice(0, 255) || null;

  const result = await db.transaction(async (tx) => {
    // De rij vergrendelen: twee gelijktijdige publicaties krijgen zo elk hun eigen versienummer.
    const [site] = await tx.select().from(sites).where(eq(sites.id, siteId)).for("update");
    if (!site) return null;

    if (site.publishedVersion !== null) {
      const [live] = await tx
        .select({ hash: siteVersions.contentHash })
        .from(siteVersions)
        .where(and(eq(siteVersions.siteId, siteId), eq(siteVersions.version, site.publishedVersion)));
      if (live?.hash === working.hash) {
        // Zelfde inhoud als de live versie: alleen weer online zetten als de site offline stond.
        if (site.status !== "live") await tx.update(sites).set({ status: "live", publishedAt: new Date(), updatedAt: new Date() }).where(eq(sites.id, siteId));
        return { site, version: site.publishedVersion, unchanged: true };
      }
    }

    const [{ latest }] = await tx.select({ latest: sql<number | null>`max(${siteVersions.version})` }).from(siteVersions).where(eq(siteVersions.siteId, siteId));
    const version = (latest ?? 0) + 1;
    await tx.insert(siteVersions).values({ siteId, version, snapshot: working.snapshot, contentHash: working.hash, note: cleanNote, createdBy: current.id });
    await tx.update(sites).set({ status: "live", publishedVersion: version, publishedAt: new Date(), updatedAt: new Date() }).where(eq(sites.id, siteId));
    // Alleen de laatste KEEP_VERSIONS bewaren; de live versie is de nieuwste en valt hier dus nooit onder.
    await tx.delete(siteVersions).where(and(eq(siteVersions.siteId, siteId), lt(siteVersions.version, version - KEEP_VERSIONS + 1)));
    return { site, version, unchanged: false };
  });

  if (!result) return { ok: false, error: NO_SITE };
  revalidatePublic(result.site);
  return { ok: true, version: result.version, unchanged: result.unchanged };
}

/** Zet de site offline. De versies blijven bewaard; opnieuw publiceren zet dezelfde inhoud weer online als er niets is gewijzigd. */
export async function unpublishSite(siteId: string): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success) return { ok: false, error: NO_SITE };
  const [site] = await db.update(sites).set({ status: "draft", publishedAt: null, updatedAt: new Date() }).where(eq(sites.id, siteId)).returning({ slug: sites.slug });
  if (!site) return { ok: false, error: NO_SITE };
  revalidatePublic(site);
  return { ok: true };
}

/** Laat een oudere versie live gaan. De werkkopie blijft zoals hij is. */
export async function rollbackSite(siteId: string, version: number): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success || !Number.isInteger(version)) return { ok: false, error: NO_SITE };
  const [row] = await db.select({ id: siteVersions.id }).from(siteVersions).where(and(eq(siteVersions.siteId, siteId), eq(siteVersions.version, version)));
  if (!row) return { ok: false, error: "Deze versie bestaat niet (meer)." };
  const [site] = await db
    .update(sites)
    .set({ status: "live", publishedVersion: version, publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(sites.id, siteId))
    .returning({ slug: sites.slug });
  if (!site) return { ok: false, error: NO_SITE };
  revalidatePublic(site);
  return { ok: true };
}

export type VersionItem = { version: number; createdAt: string; createdBy: string | null; note: string | null; live: boolean };

/** De bewaarde versies van een site, nieuwste eerst. */
export async function listVersions(siteId: string): Promise<Result<{ versions: VersionItem[] }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success) return { ok: false, error: NO_SITE };
  const [site] = await db.select({ status: sites.status, publishedVersion: sites.publishedVersion }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: NO_SITE };
  const rows = await db
    .select({ version: siteVersions.version, createdAt: siteVersions.createdAt, note: siteVersions.note, createdBy: user.name })
    .from(siteVersions)
    .leftJoin(user, eq(user.id, siteVersions.createdBy))
    .where(eq(siteVersions.siteId, siteId))
    .orderBy(desc(siteVersions.version));
  return {
    ok: true,
    versions: rows.map((r) => ({ version: r.version, createdAt: r.createdAt.toISOString(), createdBy: r.createdBy, note: r.note, live: site.status === "live" && r.version === site.publishedVersion })),
  };
}

/** De publicatiestatus van een site (voor het bijwerken van de knoppen in de builder). */
export async function fetchPublishInfo(siteId: string): Promise<Result<{ info: PublishInfo }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success) return { ok: false, error: NO_SITE };
  return { ok: true, info: await getPublishInfo(siteId) };
}
