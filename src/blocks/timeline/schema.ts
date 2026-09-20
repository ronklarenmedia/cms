import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "horizontal", label: "Horizontaal — momenten naast elkaar" },
  { id: "vertical", label: "Verticaal — langs een middellijn" },
] as const;
export type TimelineVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        // Vrije tekst: "2024", "Q1 2025" of "Maart".
        date: z.string().min(1).max(30),
        title: z.string().min(1).max(80),
        text: z.string().max(300).optional(),
      }),
    )
    .min(2)
    .max(12),
});
export type TimelineContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type TimelineSettings = z.output<typeof settings>;

export type TimelineFixture = Fixture<TimelineVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
