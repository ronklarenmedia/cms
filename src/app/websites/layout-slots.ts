import type { SiteLayout } from "@/db/schema";

export type Slot = keyof SiteLayout;

/**
 * Sitebrede plekken en de blocks die erin mogen. Een nieuw header- of footer-block toevoegen =
 * zijn slug hier bij de juiste slot zetten; het verschijnt dan vanzelf in de bibliotheek van die slot.
 */
export const slots: Record<Slot, { label: string; description: string; allowed: readonly string[] }> = {
  header: { label: "Header", description: "Staat boven elke pagina", allowed: ["site-header"] },
  footer: { label: "Footer", description: "Staat onder elke pagina", allowed: ["site-footer"] },
};

export const slotKeys = Object.keys(slots) as Slot[];
export const isSlot = (v: string): v is Slot => v in slots;

/** Blocks die alleen in een slot horen en dus nooit als gewone paginasectie mogen voorkomen. */
export const slotBlockSlugs: ReadonlySet<string> = new Set(slotKeys.flatMap((k) => slots[k].allowed));

export const emptyLayout = (): SiteLayout => ({ header: [], footer: [] });
