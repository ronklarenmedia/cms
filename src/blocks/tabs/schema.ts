import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "underline", label: "Onderstreept" },
  { id: "pills", label: "Pillen" },
] as const;
export type TabsVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(40),
        heading: z.string().max(80).optional(),
        body: z.string().min(1).max(800),
      }),
    )
    .min(2)
    .max(6),
});
export type TabsContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type TabsSettings = z.output<typeof settings>;

export type TabsFixture = Fixture<TabsVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
