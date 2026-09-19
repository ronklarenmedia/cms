import { z } from "zod";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "centered", label: "Gecentreerd" },
  { id: "left", label: "Links" },
  { id: "split", label: "Gesplitst (kop links, intro rechts)" },
] as const;
export type SectionHeadingVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().min(1).max(120),
  intro: z.string().max(300).optional(),
  buttons: z.array(buttonSchema).max(2).default([]),
});
export type SectionHeadingContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({});
export type SectionHeadingSettings = z.output<typeof settings>;

export type SectionHeadingFixture = Fixture<
  SectionHeadingVariant,
  z.input<typeof content>,
  Partial<z.input<typeof settings>>
>;
