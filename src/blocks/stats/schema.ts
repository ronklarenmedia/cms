import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "plain", label: "Eenvoudig" },
  { id: "cards", label: "Kaarten" },
  { id: "bordered", label: "Met scheidingslijnen" },
] as const;
export type StatsVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        value: z.string().min(1).max(30),
        label: z.string().min(1).max(80),
        description: z.string().max(120).optional(),
      }),
    )
    .min(1)
    .max(6),
});
export type StatsContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["2", "3", "4"]).default("4"),
});
export type StatsSettings = z.output<typeof settings>;

export type StatsFixture = Fixture<StatsVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
