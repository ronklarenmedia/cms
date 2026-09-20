"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { SiteTheme } from "@/blocks/theme";
import { db } from "@/db";
import { customers, designKits, sites } from "@/db/schema";
import { kitAllowedFor, kitsForCustomer } from "@/lib/kits";
import { NOT_LOGGED_IN, requireAdmin, staffUser } from "@/lib/session";
import { parseTheme } from "@/lib/theme-tokens";
import { isUuid } from "../websites/ids";

export type KitActionState = { error?: string } | undefined;
type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const NO_KIT = "Deze design kit bestaat niet meer.";
const nameSchema = z.string().trim().min(1, "Geef de kit een naam.").max(255, "De naam is te lang (maximaal 255 tekens).");

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

/** Slaat naam en tokens van een kit op. Alleen geldige afwijkingen van de standaard worden bewaard. */
export async function saveKit(id: string, input: { name: string; theme: Record<string, unknown> }): Promise<Result<{ tokens: number }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(id)) return { ok: false, error: NO_KIT };
  const name = nameSchema.safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  const parsed = parseTheme(input.theme);
  if (!parsed.ok) return parsed;

  const updated = await db.update(designKits).set({ name: name.data, theme: parsed.theme, updatedAt: new Date() }).where(eq(designKits.id, id)).returning({ id: designKits.id });
  if (updated.length === 0) return { ok: false, error: NO_KIT };
  revalidatePath("/design-kits");
  return { ok: true, tokens: Object.keys(parsed.theme).length };
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

export type SiteKitInfo = { current: string | null; /** Aantal eigen thema-aanpassingen van de site zelf (uit de tijd vóór design kits); die gaan boven de kit. */ overrides: number; kits: { id: string; name: string; scope: "platform" | "klant"; theme: SiteTheme }[] };

/** De kits die bij deze site kunnen (platformkits en die van de klant) en welke nu gekozen is. */
export async function getSiteKits(siteId: string): Promise<Result<{ info: SiteKitInfo }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!isUuid(siteId)) return { ok: false, error: "Deze website bestaat niet meer." };
  const [site] = await db.select({ customerId: sites.customerId, designKitId: sites.designKitId, theme: sites.theme }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet meer." };
  const kits = await kitsForCustomer(site.customerId);
  return { ok: true, info: { current: site.designKitId, overrides: Object.keys(site.theme).length, kits: kits.map((k) => ({ id: k.id, name: k.name, scope: k.customerId ? ("klant" as const) : ("platform" as const), theme: k.theme })) } };
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
