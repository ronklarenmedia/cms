import { z } from "zod";
import { BACKGROUNDS, linkSchema, SPACING, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "columns", label: "Kolommen" },
  { id: "simple", label: "Eén regel" },
] as const;
export type SiteFooterVariant = (typeof variants)[number]["id"];

export const content = z.object({
  brand: z.string().min(1).max(60),
  description: z.string().max(240).optional(),
  /** Linkkolommen met een titel (bijv. "Diensten", "Bedrijf"). Bij "Eén regel" worden alle links achter elkaar getoond. */
  columns: z
    .array(
      z.object({
        title: z.string().min(1).max(40),
        links: z.array(linkSchema).min(1).max(8),
      }),
    )
    .max(4)
    .default([]),
  contact: z
    .object({
      email: z.string().max(120).optional(),
      phone: z.string().max(40).optional(),
      address: z.string().max(200).optional(),
    })
    .optional(),
  /** Onderste balk: privacy, voorwaarden, cookies. */
  legalLinks: z.array(linkSchema).max(6).default([]),
  copyright: z.string().max(120).optional(),
});
export type SiteFooterContent = z.output<typeof content>;

// Een footer staat standaard op een donker vlak met ruime marge.
export const settings = sectionSettingsSchema.extend({
  background: z.enum(BACKGROUNDS).default("primary-dark"),
  paddingY: z.enum(SPACING).default("large"),
});
export type SiteFooterSettings = z.output<typeof settings>;

export type SiteFooterFixture = Fixture<SiteFooterVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
