import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "full", label: "Eén dia per keer" },
  { id: "peek", label: "Volgende dia piept mee" },
] as const;
export type CarouselVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  slides: z
    .array(
      z.object({
        image: imageSchema,
        heading: z.string().max(100).optional(),
        text: z.string().max(200).optional(),
      }),
    )
    .min(2)
    .max(10),
});
export type CarouselContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type CarouselSettings = z.output<typeof settings>;

export type CarouselFixture = Fixture<CarouselVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
