import { z } from "zod";
import { imageSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "cards", label: "Kaarten" },
  { id: "round", label: "Ronde portretten" },
  { id: "minimal", label: "Minimalistisch" },
] as const;
export type TeamVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  members: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        role: z.string().min(1).max(60),
        bio: z.string().max(240).optional(),
        image: imageSchema,
      }),
    )
    .min(1)
    .max(8),
});
export type TeamContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  columns: z.enum(["2", "3", "4"]).default("3"),
});
export type TeamSettings = z.output<typeof settings>;

export type TeamFixture = Fixture<TeamVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
