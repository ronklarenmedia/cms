import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "grid", label: "Raster" },
  { id: "single", label: "Eén grote quote" },
  { id: "cards", label: "Kaarten met sterren" },
] as const;
export type TestimonialsVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        quote: z.string().min(1).max(500),
        name: z.string().min(1).max(60),
        role: z.string().max(80).optional(),
        avatar: imageSchema.optional(),
        rating: z.number().int().min(1).max(5).optional(),
      }),
    )
    .min(1)
    .max(8),
});
export type TestimonialsContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["1", "2", "3"]).default("3"),
});
export type TestimonialsSettings = z.output<typeof settings>;

export type TestimonialsFixture = Fixture<
  TestimonialsVariant,
  z.input<typeof content>,
  Partial<z.input<typeof settings>>
>;
