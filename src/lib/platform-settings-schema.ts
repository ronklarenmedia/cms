import { z } from "zod";

// Types, standaardwaarden en validatie van de platforminstellingen. Bewust zonder databasetoegang, zodat ook
// client-componenten dit mogen importeren (de DB-kant staat in ./platform-settings.ts).
// Ontbreekt de rij (of de tabel), dan gelden deze standaardwaarden, zodat de app nooit stukloopt.

export type PlatformSettings = {
  platformName: string;
  adminDomain: string;
  language: string;
  timezone: string;
  supportEmail: string;
  senderName: string;
  phone: string;
  kvk: string;
};

export const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: "Ron Klaren Media",
  adminDomain: "",
  language: "nl",
  timezone: "Europe/Amsterdam",
  supportEmail: "",
  senderName: "",
  phone: "",
  kvk: "",
};

export const LANGUAGES = [{ id: "nl", label: "Nederlands" }] as const;

export const TIMEZONES = [
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Madrid",
  "Europe/Lisbon",
  "UTC",
] as const;

/** Leeg is toegestaan (optioneel veld); anders moet de waarde aan `schema` voldoen. */
const optional = <T extends z.ZodType>(schema: T) => z.union([z.literal(""), schema]);

const HOSTNAME = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export const platformSettingsSchema = z.object({
  platformName: z.string().trim().min(1, "Geef het platform een naam.").max(120, "Maximaal 120 tekens."),
  adminDomain: optional(z.string().regex(HOSTNAME, "Vul alleen een domeinnaam in, zoals beheer.voorbeeld.nl (zonder https://).")),
  language: z.enum(LANGUAGES.map((l) => l.id) as [string, ...string[]], "Kies een taal uit de lijst."),
  timezone: z.enum(TIMEZONES, "Kies een tijdzone uit de lijst."),
  supportEmail: optional(z.email("Dit is geen geldig e-mailadres.").max(255)),
  senderName: z.string().trim().max(120, "Maximaal 120 tekens."),
  phone: optional(z.string().regex(/^[+0-9 ()-]{6,25}$/, "Gebruik alleen cijfers, spaties, + ( ) en -.")),
  kvk: optional(z.string().regex(/^\d{8}$/, "Een KvK-nummer heeft 8 cijfers.")),
});
