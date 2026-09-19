import { z } from "zod";
import { buttonSchema, imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

// Varianten zijn lay-outs van dit ene block (zie de mockup: Split, Gecentreerd, Media links).
export const variants = [
  { id: "split", label: "Split — beeld rechts" },
  { id: "split-reverse", label: "Split — beeld links" },
  { id: "centered", label: "Gecentreerd" },
] as const;
export type HeroVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().min(1).max(120),
  body: z.string().max(400).optional(),
  buttons: z.array(buttonSchema).max(2).default([]),
  media: imageSchema.optional(),
});
export type HeroContent = z.output<typeof content>;

// `height` is Hero-specifiek; de rest komt uit de gedeelde sectie-instellingen.
export const settings = sectionSettingsSchema.extend({
  height: z.enum(["compact", "normal", "full"]).default("normal"),
});
export type HeroSettings = z.output<typeof settings>;

export type HeroFixture = Fixture<HeroVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
