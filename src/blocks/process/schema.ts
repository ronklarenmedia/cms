import { z } from "zod";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "horizontal", label: "Horizontaal" },
  { id: "cards", label: "Kaarten" },
  { id: "timeline", label: "Tijdlijn" },
] as const;
export type ProcessVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  steps: z
    .array(
      z.object({
        number: z.string().min(1).max(10),
        title: z.string().min(1).max(80),
        description: z.string().min(1).max(300),
        tag: z.string().max(40).optional(),
      }),
    )
    .min(2)
    .max(6),
  buttons: z.array(buttonSchema).max(2).default([]),
});
export type ProcessContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type ProcessSettings = z.output<typeof settings>;

export type ProcessFixture = Fixture<ProcessVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
