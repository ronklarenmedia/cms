import { z } from "zod";
import { linkSchema, sectionSettingsSchema, type Fixture } from "../contract";

export const variants = [
  { id: "bar", label: "Balk onderaan" },
  { id: "corner", label: "Kaart in de hoek" },
] as const;
export type CookieNoticeVariant = (typeof variants)[number]["id"];

export const content = z.object({
  heading: z.string().min(1).max(80),
  body: z.string().min(1).max(300),
  acceptLabel: z.string().min(1).max(30).default("Akkoord"),
  /** Bijv. een link naar de privacy- of cookiepagina. */
  link: linkSchema.optional(),
});
export type CookieNoticeContent = z.output<typeof content>;

export const settings = sectionSettingsSchema;
export type CookieNoticeSettings = z.output<typeof settings>;

export type CookieNoticeFixture = Fixture<CookieNoticeVariant, z.input<typeof content>, Partial<z.input<typeof settings>>>;
