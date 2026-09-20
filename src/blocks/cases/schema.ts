import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "grid", label: "Raster — gelijke kaarten" },
  { id: "featured", label: "Uitgelicht — eerste case groot" },
] as const;
export type CasesVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        client: z.string().max(60).optional(),
        summary: z.string().max(240).optional(),
        image: imageSchema,
        tags: z.array(z.string().min(1).max(30)).max(4).default([]),
        // Met een link wordt de hele kaart klikbaar; `cta` is de tekst onderaan (standaard "Bekijk de case").
        href: z.string().min(1).optional(),
        cta: z.string().max(40).optional(),
      }),
    )
    .min(1)
    .max(9),
});
export type CasesContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["2", "3"]).default("3"),
  aspect: z.enum(["photo", "square", "video"]).default("photo"),
});
export type CasesSettings = z.output<typeof settings>;

export type CasesFixture = Fixture<CasesVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
