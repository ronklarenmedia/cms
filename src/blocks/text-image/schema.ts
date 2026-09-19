import { z } from "zod";
import { buttonSchema, imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "image-right", label: "Beeld rechts" },
  { id: "image-left", label: "Beeld links" },
  { id: "cards", label: "Kaart met rand" },
] as const;
export type TextImageVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().min(1).max(120),
  body: z.string().max(1000).optional(),
  buttons: z.array(buttonSchema).max(2).default([]),
  image: imageSchema,
});
export type TextImageContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  imageRatio: z.enum(["square", "video", "photo", "portrait"]).default("photo"),
});
export type TextImageSettings = z.output<typeof settings>;

export type TextImageFixture = Fixture<
  TextImageVariant,
  z.input<typeof content>,
  Partial<z.input<typeof settings>>
>;
