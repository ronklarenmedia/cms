import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "grid", label: "Raster" },
  { id: "row", label: "Horizontale rij" },
  { id: "grayscale", label: "Gedimd (grijswaarden)" },
] as const;
export type LogoBarVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  logos: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        image: imageSchema,
        href: z.string().optional(),
      }),
    )
    .min(2)
    .max(12),
});
export type LogoBarContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({});
export type LogoBarSettings = z.output<typeof settings>;

export type LogoBarFixture = Fixture<LogoBarVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
