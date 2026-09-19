import { z } from "zod";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "cards", label: "Kaarten" },
  { id: "highlighted", label: "Uitgelicht pakket" },
  { id: "minimal", label: "Minimalistisch" },
] as const;
export type PricingVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  plans: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        price: z.string().min(1).max(30),
        period: z.string().max(30).optional(),
        description: z.string().max(160).optional(),
        badge: z.string().max(30).optional(),
        highlighted: z.boolean().default(false),
        features: z.array(z.string().min(1).max(100)).min(1).max(10),
        button: buttonSchema,
      }),
    )
    .min(1)
    .max(4),
});
export type PricingContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type PricingSettings = z.output<typeof settings>;

export type PricingFixture = Fixture<PricingVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
