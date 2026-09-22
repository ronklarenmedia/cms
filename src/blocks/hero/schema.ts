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
  /** Tweede, verschoven beeld achter `media` voor een collage-effect. Zonder `media` heeft dit geen zichtbaar effect. */
  accentMedia: imageSchema.optional(),
  /** Zwevend cijfer over het beeld, bijv. "15+" met "jaar ervaring". Alleen zichtbaar met `media`. */
  stat: z.object({ value: z.string().min(1).max(20), label: z.string().min(1).max(60) }).optional(),
  /** Korte puntenlijst onder de knoppen. Zonder `description` per item een vinkjeslijst; zodra één item een
   * `description` heeft, wordt de hele lijst als titel + tekst met een accentrand getoond. */
  highlights: z
    .array(z.object({ label: z.string().min(1).max(80), description: z.string().max(160).optional() }))
    .max(6)
    .optional(),
  /** Persoon (bijv. oprichter) onderaan de tekstkolom, met optionele foto en handtekening — voor een citaat-achtige afsluiter. */
  signee: z
    .object({
      avatar: imageSchema.optional(),
      name: z.string().min(1).max(80),
      role: z.string().max(80).optional(),
      signature: imageSchema.optional(),
    })
    .optional(),
});
export type HeroContent = z.output<typeof content>;

// `height` is Hero-specifiek; de rest komt uit de gedeelde sectie-instellingen.
export const settings = sectionSettingsSchema.extend({
  height: z.enum(["compact", "normal", "full"]).default("normal"),
});
export type HeroSettings = z.output<typeof settings>;

export type HeroFixture = Fixture<HeroVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
