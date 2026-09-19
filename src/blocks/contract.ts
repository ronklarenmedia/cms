// Het block-contract. Elk block onder src/blocks/<slug>/ levert precies dit aan via defineBlock().
// Lees src/blocks/README.md voor de regels; `npm run check:blocks` controleert ze.
import type { ComponentType } from "react";
import { z } from "zod";

// ── Gedeelde bouwstenen voor inhoud ───────────────────────────────────────────

/** Afbeelding: `alt` is verplicht; alleen puur decoratieve beelden mogen `decorative: true` met lege alt. */
export const imageSchema = z
  .object({
    url: z.string().min(1),
    alt: z.string(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    decorative: z.boolean().default(false),
  })
  .refine((img) => img.decorative || img.alt.trim().length > 0, {
    message: "alt-tekst is verplicht (of zet decorative: true)",
    path: ["alt"],
  });
export type Image = z.output<typeof imageSchema>;

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/** Knop: een link met een stijl. Maximaal één `primary` per sectie is de vuistregel. */
export const buttonSchema = linkSchema.extend({
  style: z.enum(["primary", "secondary"]).default("primary"),
});
export type Button = z.output<typeof buttonSchema>;

// ── Vaste sectie-instellingen (het rechter paneel in de builder) ──────────────
// Waarden zijn tokennamen, nooit vrije CSS-waarden.

export const SPACING = ["xs", "small", "standard", "medium", "large", "xl", "xxl"] as const;
export const BACKGROUNDS = [
  "none",
  "off-white",
  "primary-light",
  "secondary-light",
  "primary",
  "primary-dark",
  "black",
] as const;
export const MAX_WIDTHS = ["small", "standard", "medium", "large", "full"] as const;

export const sectionSettingsSchema = z.object({
  background: z.enum(BACKGROUNDS).default("none"),
  paddingY: z.enum(SPACING).default("xl"),
  maxWidth: z.enum(MAX_WIDTHS).default("large"),
  align: z.enum(["left", "center"]).default("left"),
  /** Zichtbaarheid per apparaat; volgt de container-breedte, dus werkt ook in het builder-canvas. */
  visibility: z
    .object({
      desktop: z.boolean().default(true),
      tablet: z.boolean().default(true),
      mobile: z.boolean().default(true),
    })
    .default({ desktop: true, tablet: true, mobile: true }),
  /** Ankernaam voor #-links, zonder #. */
  anchor: z.string().regex(/^[a-z][a-z0-9-]*$/).optional(),
});
export type SectionSettings = z.output<typeof sectionSettingsSchema>;

// ── Block-definitie ───────────────────────────────────────────────────────────

export const CATEGORIES = [
  "Navigatie",
  "Hero's",
  "Content",
  "Media",
  "Formulieren",
  "Commerce",
  "Vertrouwen",
  "Afsluiters",
] as const;
export type Category = (typeof CATEGORIES)[number];
export type Status = "kit-ready" | "beta" | "verouderd";

export type BlockProps<Variant extends string = string, Content = unknown, Settings = SectionSettings> = {
  variant: Variant;
  content: Content;
  settings: Settings;
};

type VariantDef = { readonly id: string; readonly label: string };

export type Fixture<Variant extends string, Content, Settings> = {
  /** Korte naam, getoond in de showcase. */
  name: string;
  variant: Variant;
  content: Content;
  settings?: Partial<Settings>;
};

export type BlockDefinition<
  V extends readonly VariantDef[] = readonly VariantDef[],
  C extends z.ZodType = z.ZodType,
  S extends z.ZodType = z.ZodType,
> = {
  /** kebab-case; gelijk aan de mapnaam. */
  slug: string;
  label: string;
  description: string;
  category: Category;
  /** Phosphor-icoonnaam zonder "ph-", voor de bibliotheek in de builder. */
  icon: string;
  status: Status;
  /** Varianten zijn lay-outs van hetzelfde block, geen aparte blocks. */
  variants: V;
  /** Wat de redacteur invult. Geen kleuren of maten. */
  content: C;
  /** Uiterlijk: sectie-instellingen plus eventueel block-specifieke opties. */
  settings: S;
  /** Minstens één fixture per variant; zie de checker. */
  fixtures: readonly Fixture<V[number]["id"], z.input<C>, Partial<z.input<S>>>[];
  /** Rendert alleen de inhoud van de sectie; wrapper, achtergrond en ruimte doet <Section>. */
  Component: ComponentType<BlockProps<V[number]["id"], z.output<C>, z.output<S>>>;
};

/** Type-uitgewist beeld van een block, voor de registry en de renderer. */
export type AnyBlock = {
  slug: string;
  label: string;
  description: string;
  category: Category;
  icon: string;
  status: Status;
  variants: readonly VariantDef[];
  content: z.ZodType;
  settings: z.ZodType;
  fixtures: readonly { name: string; variant: string; content: unknown; settings?: unknown }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
};

export function defineBlock<
  const V extends readonly VariantDef[],
  C extends z.ZodType,
  S extends z.ZodType,
>(def: BlockDefinition<V, C, S>): BlockDefinition<V, C, S> {
  return def;
}

/** Zo staat een block opgeslagen in `pages.content` (JSONB). */
export function sectionSchemaFor(block: AnyBlock) {
  const variantIds = block.variants.map((v) => v.id) as [string, ...string[]];
  return z.object({
    id: z.string().min(1),
    type: z.literal(block.slug),
    variant: z.enum(variantIds),
    content: block.content,
    // prefault: de lege waarde gaat nog door het schema, zodat de standaardwaarden worden ingevuld.
    settings: block.settings.prefault({}),
  });
}
export type SectionData = { id: string; type: string; variant: string; content: unknown; settings?: unknown };
