import type { HostedFont } from "@/db/schema";
import fontsIndex from "./google-fonts-index.json";

// De doorzoekbare Google Fonts-index (namen/categorieën, geen bestanden — zie scripts/update-google-fonts-index.ts).
// Bewust zonder server-afhankelijkheden (geen node:crypto, geen R2), zodat ook client-componenten zoals FontPicker.tsx
// dit mogen importeren; het echte ophalen en opslaan staat in ./google-fonts.ts.

export type GoogleFontIndexEntry = { family: string; category: HostedFont["category"]; variable: boolean; wght: string };
const INDEX = fontsIndex as GoogleFontIndexEntry[];

export const googleFontsIndex = (): readonly GoogleFontIndexEntry[] => INDEX;

/** Alleen namen die in de gebundelde index staan; sluit uit dat een verzonnen naam wordt opgehaald. */
export function findInFontsIndex(family: string): GoogleFontIndexEntry | null {
  const needle = family.trim().toLowerCase();
  return INDEX.find((f) => f.family.toLowerCase() === needle) ?? null;
}
