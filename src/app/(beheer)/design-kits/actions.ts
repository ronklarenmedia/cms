"use server";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { SiteTheme, ThemeToken } from "@/blocks/theme";
import { db } from "@/db";
import { customers, designKits, designKitVersions, sites, user } from "@/db/schema";
import { kitAllowedFor, kitsForCustomer } from "@/lib/kits";
import { NOT_LOGGED_IN, requireAdmin, staffUser } from "@/lib/session";
import { isToken, parseTheme, tokenLabel } from "@/lib/theme-tokens";
import { isUuid } from "../websites/ids";

export type KitActionState = { error?: string } | undefined;
type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const NO_KIT = "Deze design kit bestaat niet meer.";
const nameSchema = z.string().trim().min(1, "Geef de kit een naam.").max(255, "De naam is te lang (maximaal 255 tekens).");
/** Zoveel versies per kit bewaren we; oudere worden bij het opslaan opgeruimd (zelfde aantal als site-versies). */
const KEEP_KIT_VERSIONS = 20;

/** Maakt een nieuwe kit, leeg of als kopie van een bestaande, en gaat naar de editor. `customerId` leeg = platformkit. */
export async function createKit(_prev: KitActionState, formData: FormData): Promise<KitActionState> {
  if (!(await staffUser())) return { error: NOT_LOGGED_IN };
  const name = nameSchema.safeParse(formData.get("name"));
  if (!name.success) return { error: name.error.issues[0].message };
  const customerId = String(formData.get("customerId") ?? "") || null;
  const base = String(formData.get("base") ?? "leeg");

  if (customerId) {
    if (!isUuid(customerId)) return { error: "Deze klant bestaat niet (meer)." };
    const [customer] = await db.select({ id: customers.id }).from(customers).where(eq(customers.id, customerId));
    if (!customer) return { error: "Deze klant bestaat niet (meer)." };
  }

  let theme: SiteTheme = {};
  if (base !== "leeg") {
    if (!isUuid(base)) return { error: "De gekozen startkit bestaat niet (meer)." };
    const [source] = await db.select({ theme: designKits.theme }).from(designKits).where(eq(designKits.id, base));
    if (!source) return { error: "De gekozen startkit bestaat niet (meer)." };
    theme = source.theme;
  }

  const user = await staffUser();
  const [created] = await db.insert(designKits).values({ name: name.data, customerId, theme, createdBy: user?.id }).returning({ id: designKits.id });
  revalidatePath("/design-kits");
  redirect(`/design-kits/${created.id}`);
}

/**
 * Slaat naam en tokens van een kit op. Alleen geldige afwijkingen van de standaard worden bewaard. Legt de nieuwe
 * stand meteen ook vast als een nieuwe versie (zie KEEP_KIT_VERSIONS en "Versies" in de editor) — een kit heeft
 * geen apart publiceren, de nieuwe waarden gelden meteen voor elke site die de kit gebruikt.
 */
export async function saveKit(id: string, input: { name: string; theme: Record<string, unknown> }): Promise<Result<{ tokens: number }>> {
  const current = await staffUser();
  if (!current) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(id)) return { ok: false, error: NO_KIT };
  const name = nameSchema.safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  const parsed = parseTheme(input.theme);
  if (!parsed.ok) return parsed;

  const updated = await db.transaction(async (tx) => {
    const [existing] = await tx.select({ id: designKits.id }).from(designKits).where(eq(designKits.id, id)).for("update");
    if (!existing) return null;
    await recordKitVersion(tx, id, name.data, parsed.theme, current.id);
    return tx.update(designKits).set({ name: name.data, theme: parsed.theme, updatedAt: new Date() }).where(eq(designKits.id, id)).returning({ id: designKits.id });
  });
  if (!updated || updated.length === 0) return { ok: false, error: NO_KIT };
  revalidatePath("/design-kits");
  return { ok: true, tokens: Object.keys(parsed.theme).length };
}

/** Legt `theme` vast als de eerstvolgende versie van een kit en ruimt versies ouder dan KEEP_KIT_VERSIONS op. Alleen binnen een transactie met de rij al vergrendeld. */
async function recordKitVersion(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], kitId: string, name: string, theme: SiteTheme, createdBy: string) {
  const [{ latest }] = await tx.select({ latest: sql<number | null>`max(${designKitVersions.version})` }).from(designKitVersions).where(eq(designKitVersions.kitId, kitId));
  const version = (latest ?? 0) + 1;
  await tx.insert(designKitVersions).values({ kitId, version, name, theme, createdBy });
  await tx.delete(designKitVersions).where(and(eq(designKitVersions.kitId, kitId), sql`${designKitVersions.version} < ${version - KEEP_KIT_VERSIONS + 1}`));
}

export type KitVersionItem = { version: number; createdAt: string; createdBy: string | null; name: string; tokens: number };

/** De bewaarde versies van een kit (de stand na elke opslag), nieuwste eerst. */
export async function listKitVersions(kitId: string): Promise<Result<{ versions: KitVersionItem[] }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(kitId)) return { ok: false, error: NO_KIT };
  const [kit] = await db.select({ id: designKits.id }).from(designKits).where(eq(designKits.id, kitId));
  if (!kit) return { ok: false, error: NO_KIT };
  const rows = await db
    .select({ version: designKitVersions.version, createdAt: designKitVersions.createdAt, createdBy: user.name, name: designKitVersions.name, theme: designKitVersions.theme })
    .from(designKitVersions)
    .leftJoin(user, eq(user.id, designKitVersions.createdBy))
    .where(eq(designKitVersions.kitId, kitId))
    .orderBy(desc(designKitVersions.version));
  return { ok: true, versions: rows.map((r) => ({ version: r.version, createdAt: r.createdAt.toISOString(), createdBy: r.createdBy, name: r.name, tokens: Object.keys(r.theme).length })) };
}

/** Zet een oudere versie van een kit terug als de huidige stand; dat zelf wordt ook als nieuwe versie vastgelegd, dus ongedaan te maken door opnieuw terug te zetten. */
export async function rollbackKit(kitId: string, version: number): Promise<Result> {
  const current = await staffUser();
  if (!current) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(kitId) || !Number.isInteger(version)) return { ok: false, error: NO_KIT };

  const ok = await db.transaction(async (tx) => {
    const [target] = await tx.select({ name: designKitVersions.name, theme: designKitVersions.theme }).from(designKitVersions).where(and(eq(designKitVersions.kitId, kitId), eq(designKitVersions.version, version)));
    if (!target) return false;
    const [existing] = await tx.select({ id: designKits.id }).from(designKits).where(eq(designKits.id, kitId)).for("update");
    if (!existing) return false;

    await recordKitVersion(tx, kitId, target.name, target.theme, current.id);
    await tx.update(designKits).set({ name: target.name, theme: target.theme, updatedAt: new Date() }).where(eq(designKits.id, kitId));
    return true;
  });
  if (!ok) return { ok: false, error: NO_KIT };
  revalidatePath("/design-kits");
  return { ok: true };
}

/** Verwijdert een kit die door geen enkele site wordt gebruikt. Alleen de platform-admin. */
export async function deleteKit(id: string): Promise<Result> {
  await requireAdmin();
  if (!isUuid(id)) return { ok: false, error: NO_KIT };
  const [{ uses }] = await db.select({ uses: count() }).from(sites).where(eq(sites.designKitId, id));
  if (uses > 0) return { ok: false, error: `Deze kit wordt door ${uses} ${uses === 1 ? "website" : "websites"} gebruikt. Kies eerst bij die websites een andere kit.` };
  const removed = await db.delete(designKits).where(eq(designKits.id, id)).returning({ id: designKits.id });
  if (removed.length === 0) return { ok: false, error: NO_KIT };
  revalidatePath("/design-kits");
  return { ok: true };
}

export type SiteKitInfo = {
  current: string | null;
  /** De eigen thema-aanpassingen van de site zelf (uit de tijd vóór design kits); die gaan boven de kit. */
  overrides: { token: string; label: string; value: string }[];
  kits: { id: string; name: string; scope: "platform" | "klant"; theme: SiteTheme }[];
};

/** De kits die bij deze site kunnen (platformkits en die van de klant), welke nu gekozen is, en de eigen tokens die de site nog afwijkt. */
export async function getSiteKits(siteId: string): Promise<Result<{ info: SiteKitInfo }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(siteId)) return { ok: false, error: "Deze website bestaat niet meer." };
  const [site] = await db.select({ customerId: sites.customerId, designKitId: sites.designKitId, theme: sites.theme }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet meer." };
  const kits = await kitsForCustomer(site.customerId);
  const overrides = Object.entries(site.theme)
    .filter((entry): entry is [ThemeToken, string | number] => isToken(entry[0]))
    .map(([token, value]) => ({ token, label: tokenLabel(token), value: String(value) }));
  return { ok: true, info: { current: site.designKitId, overrides, kits: kits.map((k) => ({ id: k.id, name: k.name, scope: k.customerId ? ("klant" as const) : ("platform" as const), theme: k.theme })) } };
}

/** Kiest de design kit van een site (of haalt hem weg). De eigen aanpassingen van de site blijven gelden; live sites krijgen de nieuwe stijl bij hun volgende publicatie. */
export async function setSiteKit(siteId: string, kitId: string | null): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(siteId) || (kitId !== null && !isUuid(kitId))) return { ok: false, error: "Deze website of kit bestaat niet meer." };
  const [site] = await db.select({ customerId: sites.customerId }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet meer." };
  if (kitId !== null && !(await kitAllowedFor(kitId, site.customerId))) return { ok: false, error: "Deze kit is niet beschikbaar voor deze klant." };
  await db.update(sites).set({ designKitId: kitId, updatedAt: new Date() }).where(eq(sites.id, siteId));
  revalidatePath("/design-kits");
  revalidatePath("/websites");
  return { ok: true };
}

/** Wist de eigen thema-aanpassingen van een site, zodat alleen de design kit (en de standaard) nog telt. */
export async function clearSiteOverrides(siteId: string): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(siteId)) return { ok: false, error: "Deze website bestaat niet meer." };
  const updated = await db.update(sites).set({ theme: {}, updatedAt: new Date() }).where(eq(sites.id, siteId)).returning({ id: sites.id });
  if (updated.length === 0) return { ok: false, error: "Deze website bestaat niet meer." };
  revalidatePath("/websites");
  return { ok: true };
}
