import { z } from "zod";
import type { ThemeToken } from "@/blocks/theme";
import { COLOR_TOKENS } from "@/lib/theme-tokens";
import { sectionSettingsSchema, type Fixture } from "../contract";

const colorToken = z.enum(COLOR_TOKENS as [ThemeToken, ...ThemeToken[]]);

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
        /** Eén emoji/teken (vrij, wordt letterlijk getoond), of de naam van een gehost Material Symbol (src/lib/material-icons.ts); puur decoratief (aria-hidden). */
        icon: z.string().max(60).optional(),
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
  /** "bare" = icoon zonder omkadering; "framed" = icoon in een kader met rand en achtergrond. */
  iconStyle: z.enum(["bare", "framed"]).default("bare"),
  /** Kleur van het icoon zelf; elke kleur uit het thema, niet alleen de merkkleuren. */
  iconColor: colorToken.default("colorAccent"),
  /** Alleen zichtbaar effect bij iconStyle "framed". */
  iconBorderWidth: z.enum(["thin", "standard", "thick"]).default("thin"),
  iconBorderColor: colorToken.default("colorAccent"),
  iconBackgroundColor: colorToken.default("colorBgPrimaryLight"),
  /** Hoekafronding van het kader: "none" is vierkant, "full" is een cirkel. Alleen zichtbaar effect bij iconStyle "framed". */
  iconRadius: z.enum(["none", "small", "standard", "medium", "large", "full"]).default("full"),
});
export type UspGridSettings = z.output<typeof settings>;

export type UspGridFixture = Fixture<UspGridVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
