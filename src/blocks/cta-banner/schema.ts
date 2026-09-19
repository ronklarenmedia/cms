import { z } from "zod";
import { BACKGROUNDS, buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "centered", label: "Gecentreerd" },
  { id: "split", label: "Split — tekst links, knoppen rechts" },
] as const;
export type CtaBannerVariant = (typeof variants)[number]["id"];

export const content = z.object({
  heading: z.string().min(1).max(120),
  body: z.string().max(240).optional(),
  // Een banner zonder actie is geen banner.
  buttons: z.array(buttonSchema).min(1).max(2),
});
export type CtaBannerContent = z.output<typeof content>;

// Zelfde instellingen als elke sectie, maar dit block staat standaard op de primaire kleur.
export const settings = sectionSettingsSchema.extend({
  background: z.enum(BACKGROUNDS).default("primary"),
});
export type CtaBannerSettings = z.output<typeof settings>;

export type CtaBannerFixture = Fixture<CtaBannerVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
