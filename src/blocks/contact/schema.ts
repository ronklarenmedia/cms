import { z } from "zod";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "split", label: "Split — tekst links, gegevens rechts" },
  { id: "cards", label: "Kaarten naast elkaar" },
  { id: "centered", label: "Gecentreerd" },
] as const;
export type ContactVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  email: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  address: z.string().max(200).optional(),
  hours: z
    .array(
      z.object({
        day: z.string().min(1).max(40),
        time: z.string().min(1).max(40),
      }),
    )
    .max(7)
    .default([]),
  /** Bijv. "Route uitstippelen" naar een kaartendienst, of "Bel ons" (tel:-link). */
  buttons: z.array(buttonSchema).max(2).default([]),
});
export type ContactContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type ContactSettings = z.output<typeof settings>;

export type ContactFixture = Fixture<ContactVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
