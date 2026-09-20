import { asc, eq, isNull, or } from "drizzle-orm";
import type { SiteTheme } from "@/blocks/theme";
import { db } from "@/db";
import { designKits } from "@/db/schema";
import { parseTheme } from "./theme-tokens";

// Design kits: opgeslagen thema's waar sites naar verwijzen. Alleen op de server. De editor en de validatie van tokens staan in
// ./theme-tokens.ts (ook voor de browser).

/**
 * Het thema van een site: de tokens van de kit met de eigen afwijkingen van de site erbovenop. `themeToCssVars` vult de rest aan met
 * de standaardwaarden. Zonder kit is dit gewoon `site.theme`, dus bestaande sites veranderen niet.
 */
export async function effectiveSiteTheme(site: { theme: SiteTheme; designKitId: string | null }): Promise<SiteTheme> {
  if (!site.designKitId) return site.theme;
  const [kit] = await db.select({ theme: designKits.theme }).from(designKits).where(eq(designKits.id, site.designKitId));
  if (!kit) return site.theme;
  // Een kit uit de database gaat door dezelfde controle als bij het opslaan; ongeldige tokens worden overgeslagen, nooit gerenderd.
  const checked = parseTheme(kit.theme);
  return { ...(checked.ok ? checked.theme : {}), ...site.theme };
}

export type KitOption = { id: string; name: string; customerId: string | null; theme: SiteTheme };

/** De kits die een site van deze klant mag gebruiken: alle platformkits plus de kits van de klant zelf. */
export async function kitsForCustomer(customerId: string): Promise<KitOption[]> {
  const rows = await db
    .select({ id: designKits.id, name: designKits.name, customerId: designKits.customerId, theme: designKits.theme })
    .from(designKits)
    .where(or(isNull(designKits.customerId), eq(designKits.customerId, customerId)))
    .orderBy(asc(designKits.customerId), asc(designKits.name));
  return rows;
}

/** Mag deze kit bij een site van deze klant? */
export async function kitAllowedFor(kitId: string, customerId: string): Promise<boolean> {
  const [kit] = await db.select({ customerId: designKits.customerId }).from(designKits).where(eq(designKits.id, kitId));
  return !!kit && (kit.customerId === null || kit.customerId === customerId);
}

/** Startpunten voor een nieuwe kit: alle bestaande kits, platformkits eerst. */
export async function listKitSources(): Promise<{ id: string; name: string; customerId: string | null }[]> {
  return db.select({ id: designKits.id, name: designKits.name, customerId: designKits.customerId }).from(designKits).orderBy(asc(designKits.customerId), asc(designKits.name));
}
