import { z } from "zod";
import { buttonSchema, imageSchema, linkSchema, SPACING, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "inline", label: "Logo links, menu rechts" },
  { id: "centered", label: "Gecentreerd" },
] as const;
export type SiteHeaderVariant = (typeof variants)[number]["id"];

// Eén niveau uitklapmenu: genoeg voor een gewone site en houdt het formulier in de builder overzichtelijk.
const navItem = linkSchema.extend({
  children: z.array(linkSchema).max(8).default([]),
});

export const content = z.object({
  /** Naam van de site: tekstlogo, en de titel van de link naar de homepagina. */
  brand: z.string().min(1).max(60),
  logo: imageSchema.optional(),
  links: z.array(navItem).max(8).default([]),
  /** Eén opvallende knop rechts (bijv. "Neem contact op"). */
  button: buttonSchema.optional(),
});
export type SiteHeaderContent = z.output<typeof content>;

// Een header is compacter dan een gewone sectie: standaard weinig ruimte boven en onder.
export const settings = sectionSettingsSchema.extend({
  paddingY: z.enum(SPACING).default("small"),
});
export type SiteHeaderSettings = z.output<typeof settings>;

export type SiteHeaderFixture = Fixture<SiteHeaderVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
