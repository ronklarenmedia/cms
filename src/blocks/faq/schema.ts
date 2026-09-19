import { z } from "zod";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "accordion", label: "Accordeon" },
  { id: "two-column", label: "Twee kolommen" },
  { id: "cards", label: "Kaarten" },
] as const;
export type FaqVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1).max(180),
        answer: z.string().min(1).max(1000),
      }),
    )
    .min(1)
    .max(12),
  button: buttonSchema.optional(),
});
export type FaqContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type FaqSettings = z.output<typeof settings>;

export type FaqFixture = Fixture<FaqVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
