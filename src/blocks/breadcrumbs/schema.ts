import { z } from "zod";
import { SPACING, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "chevron", label: "Pijltjes tussen de onderdelen" },
  { id: "slash", label: "Schuine streep tussen de onderdelen" },
] as const;
export type BreadcrumbsVariant = (typeof variants)[number]["id"];

export const content = z.object({
  // Van links naar rechts, van de startpagina naar de huidige pagina. Het laatste onderdeel is de huidige pagina en heeft geen link nodig.
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
        href: z.string().min(1).optional(),
      }),
    )
    .min(2)
    .max(6),
});
export type BreadcrumbsContent = z.output<typeof content>;

// Een kruimelpad is een smalle strook: standaard weinig ruimte boven en onder.
export const settings = sectionSettingsSchema.extend({
  paddingY: z.enum(SPACING).default("small"),
});
export type BreadcrumbsSettings = z.output<typeof settings>;

export type BreadcrumbsFixture = Fixture<BreadcrumbsVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
