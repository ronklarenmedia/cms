import type { SnapshotPage } from "@/db/schema";

// Optionele scripts voor openbare pagina's. Uitgangspunt: een pagina bestaat uit HTML en CSS en levert GEEN JavaScript mee (geen React, geen
// hydratatie). Heeft een block toch JavaScript nodig, dan komt dat hier als een "enhancement": een klein, los script in gewone JavaScript
// (geen React) dat alleen op pagina's met dat block wordt geladen en de pagina verrijkt. Zonder het script blijft de pagina volledig bruikbaar.
// Zie docs/publieke-paginas-zonder-js.md voor wanneer dat past en wanneer CSS genoeg is.

export type Enhancement = {
  /** Bestandsnaam zonder .js in public/enhance/v1/. */
  id: string;
  /** De blocks (slug) op wiens aanwezigheid het script wordt meegeleverd. */
  blocks: readonly string[];
  /** Wat het doet, voor wie het later tegenkomt. */
  purpose: string;
};

/** Map met de scripts; nieuwe versie = nieuwe map (de bestanden zijn `immutable` gecachet, zie next.config.ts). */
export const ENHANCE_DIR = "/enhance/v1";

/** Nu geen enkele. Toevoegen: script in public/enhance/v1/<id>.js zetten en hier registreren. */
export const ENHANCEMENTS: readonly Enhancement[] = [];

export const enhancementUrl = (e: Enhancement) => `${ENHANCE_DIR}/${e.id}.js`;

/** De scripts die een pagina nodig heeft: van elk aanwezig block met een enhancement, één keer. */
export function enhancementsFor(
  page: Pick<SnapshotPage, "sections">,
  layout: { header: readonly { type: string }[]; footer: readonly { type: string }[] },
  registry: readonly Enhancement[] = ENHANCEMENTS,
): Enhancement[] {
  const present = new Set([...layout.header, ...page.sections, ...layout.footer].map((s) => s.type));
  return registry.filter((e) => e.blocks.some((b) => present.has(b)));
}
