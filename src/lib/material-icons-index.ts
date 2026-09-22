import iconNames from "./material-icons-index.json";

// De doorzoekbare naamindex van Material Symbols-iconen (zie scripts/update-material-icons-index.ts). Bewust zonder
// server-afhankelijkheden, zodat ook client-componenten zoals IconPicker.tsx dit mogen importeren; het echte ophalen
// en saneren staat in ./material-icons.ts.

const NAMES = new Set(iconNames as string[]);

export const materialIconNames = (): readonly string[] => iconNames as string[];

/** Alleen namen die in de gebundelde index staan; sluit uit dat een verzonnen naam wordt opgehaald. */
export const isKnownIconName = (name: string): boolean => NAMES.has(name);
