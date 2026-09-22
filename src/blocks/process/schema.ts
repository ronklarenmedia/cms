import { z } from "zod";
import type { ThemeToken } from "@/blocks/theme";
import { COLOR_TOKENS } from "@/lib/theme-tokens";
import { buttonSchema, sectionSettingsSchema, type Fixture } from "../contract";

const colorToken = z.enum(COLOR_TOKENS as [ThemeToken, ...ThemeToken[]]);

export const variants = [
  { id: "horizontal", label: "Horizontaal" },
  { id: "cards", label: "Kaarten" },
  { id: "timeline", label: "Tijdlijn" },
] as const;
export type ProcessVariant = (typeof variants)[number]["id"];

export const content = z.object({
  eyebrow: z.string().max(60).optional(),
  heading: z.string().max(120).optional(),
  intro: z.string().max(300).optional(),
  steps: z
    .array(
      z.object({
        number: z.string().min(1).max(10),
        /** Eén emoji/teken (vrij, wordt letterlijk getoond), of de naam van een gehost Material Symbol. Vervangt het nummer in de ronde markering als het is ingevuld; puur decoratief (aria-hidden). */
        icon: z.string().max(60).optional(),
        title: z.string().min(1).max(80),
        description: z.string().min(1).max(300),
        tag: z.string().max(40).optional(),
      }),
    )
    .min(2)
    .max(6),
  buttons: z.array(buttonSchema).max(2).default([]),
});
export type ProcessContent = z.output<typeof content>;

export const settings = sectionSettingsSchema.extend({
  /** Kleur van het icoon in de ronde markering (alleen zichtbaar effect als een stap een icoon heeft). */
  iconColor: colorToken.default("colorWhite"),
  iconBorderWidth: z.enum(["thin", "standard", "thick"]).default("thin"),
  iconBorderColor: colorToken.default("colorAccent"),
  iconBackgroundColor: colorToken.default("colorAccent"),
  /** Hoekafronding van de markering: "full" (standaard) is een cirkel, "none" is vierkant. */
  iconRadius: z.enum(["none", "small", "standard", "medium", "large", "full"]).default("full"),
});
export type ProcessSettings = z.output<typeof settings>;

export type ProcessFixture = Fixture<ProcessVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
