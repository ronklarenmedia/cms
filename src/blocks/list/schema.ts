import { z } from "zod";
import { sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "detailed", label: "Uitgebreid — label, titel, tekst en pijl" },
  { id: "simple", label: "Simpel — titel met tags rechts" },
] as const;
export type ListVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        // Alleen bij "Uitgebreid": klein label links en een korte tekst.
        tag: z.string().max(30).optional(),
        text: z.string().max(300).optional(),
        // Alleen bij "Simpel": tags rechts van de titel.
        tags: z.array(z.string().min(1).max(30)).max(5).default([]),
        // Optioneel: de hele rij wordt dan een link.
        href: z.string().min(1).optional(),
      }),
    )
    .min(1)
    .max(12),
});
export type ListContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type ListSettings = z.output<typeof settings>;

export type ListFixture = Fixture<ListVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
