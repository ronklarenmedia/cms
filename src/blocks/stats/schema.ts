import { z } from "zod";
import type { ThemeToken } from "@/blocks/theme";
import { COLOR_TOKENS } from "@/lib/theme-tokens";
import { sectionSettingsSchema, type Fixture } from "../contract";

const colorToken = z.enum(COLOR_TOKENS as [ThemeToken, ...ThemeToken[]]);

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
        /** Eén emoji/teken (vrij, wordt letterlijk getoond), of de naam van een gehost Material Symbol. Optioneel, boven het cijfer; puur decoratief (aria-hidden). */
        icon: z.string().max(60).optional(),
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
  /** "bare" = icoon zonder omkadering; "framed" = icoon in een kader met rand en achtergrond. */
  iconStyle: z.enum(["bare", "framed"]).default("bare"),
  iconColor: colorToken.default("colorAccent"),
  iconBorderWidth: z.enum(["thin", "standard", "thick"]).default("thin"),
  iconBorderColor: colorToken.default("colorAccent"),
  iconBackgroundColor: colorToken.default("colorBgPrimaryLight"),
  iconRadius: z.enum(["none", "small", "standard", "medium", "large", "full"]).default("full"),
});
export type StatsSettings = z.output<typeof settings>;

export type StatsFixture = Fixture<StatsVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
