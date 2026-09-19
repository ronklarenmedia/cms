import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "plain", label: "Eenvoudig" },
  { id: "cards", label: "Kaarten" },
  { id: "centered", label: "Gecentreerd" },
] as const;
export type UspGridVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        /** Eén emoji of teken; puur decoratief (aria-hidden). */
        icon: z.string().max(4).optional(),
        heading: z.string().min(1).max(80),
        text: z.string().max(240).optional(),
      }),
    )
    .min(1)
    .max(12),
});
export type UspGridContent = z.output<typeof content>;

// Enum met strings: een select in de builder levert strings op.
export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["2", "3", "4"]).default("3"),
});
export type UspGridSettings = z.output<typeof settings>;

export type UspGridFixture = Fixture<UspGridVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
