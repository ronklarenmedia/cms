import { defaultTheme, type SiteTheme } from "@/blocks/theme";

// Zelf gehoste webfonts voor de design kits. De bestanden staan in public/fonts/v1 (zie de README daar) en worden op elk domein van een
// klantsite geserveerd: een pad met een punt omzeilt de proxy, en next.config.ts geeft ze een jaar cache. Geen lettertype-dienst van derden.
//
// Een kit bewaart gewoon een lettertypestack als tokenwaarde ("Playfair Display", Georgia, serif); komt de eerste naam in de stack in deze
// catalogus voor, dan wordt het bestand bij het renderen van de pagina meegeleverd (@font-face + preload). Zonder schemawijziging.

/** Map met de bestanden; bij het vervangen van een bestand een nieuw versienummer nemen (ze zijn `immutable` gecachet). */
export const FONT_DIR = "/fonts/v1";

export type FontCategory = "sans" | "serif" | "mono";
export type WebFont = {
  id: string;
  family: string;
  category: FontCategory;
  /** Bestandsnaam in FONT_DIR. */
  file: string;
  /** Het gewichtsbereik in CSS-notatie: "100 900" bij een variabel lettertype, "400" bij een enkel gewicht. */
  weights: string;
  /** Grootte van het bestand, voor de indicatie in de editor. */
  bytes: number;
};

const font = (id: string, family: string, category: FontCategory, weights: string, bytes: number, file = `${id}-latin-wght-normal.woff2`): WebFont => ({ id, family, category, weights, bytes, file });

// Alleen het Latijnse subset en alleen rechtopstaand (geen cursief); zie public/fonts/README.md.
export const CATALOGUE: readonly WebFont[] = [
  font("inter", "Inter", "sans", "100 900", 48256),
  font("dm-sans", "DM Sans", "sans", "100 1000", 36932),
  font("manrope", "Manrope", "sans", "200 800", 24836),
  font("plus-jakarta-sans", "Plus Jakarta Sans", "sans", "200 800", 27348),
  font("work-sans", "Work Sans", "sans", "100 900", 50316),
  font("montserrat", "Montserrat", "sans", "100 900", 37956),
  font("outfit", "Outfit", "sans", "100 900", 32292),
  font("space-grotesk", "Space Grotesk", "sans", "300 700", 22288),
  font("playfair-display", "Playfair Display", "serif", "400 900", 38404),
  font("lora", "Lora", "serif", "400 700", 37788),
  font("source-serif-4", "Source Serif 4", "serif", "200 900", 50824),
  font("fraunces", "Fraunces", "serif", "100 900", 36620),
  font("dm-serif-display", "DM Serif Display", "serif", "400", 24744, "dm-serif-display-latin-400-normal.woff2"),
  font("jetbrains-mono", "JetBrains Mono", "mono", "100 800", 40404),
];

const FALLBACK: Record<FontCategory, string> = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

/** De lettertypestack voor een tokenwaarde: de naam gevolgd door veilige terugvalfonts (tijdens het laden en voor tekens buiten het subset). */
export const fontStack = (f: WebFont) => `"${f.family}", ${FALLBACK[f.category]}`;

/** Systeemlettertypes: niets te laden, altijd beschikbaar. */
export const SYSTEM_STACKS = [
  { label: "Systeemlettertype", stack: FALLBACK.sans },
  { label: "Georgia", stack: FALLBACK.serif },
  { label: "Helvetica / Arial", stack: '"Helvetica Neue", Arial, sans-serif' },
  { label: "Systeem monospace", stack: FALLBACK.mono },
] as const;

/** De eerste familienaam uit een stack, zonder aanhalingstekens ("\"Playfair Display\", Georgia" → "Playfair Display"). */
export const firstFamily = (stack: string | number): string => String(stack).split(",")[0].replace(/["']/g, "").trim();

const byFamily = new Map(CATALOGUE.map((f) => [f.family.toLowerCase(), f]));
/** Het webfont bij een stack, als de eerste naam in de catalogus staat. */
export const webFontFor = (stack: string | number): WebFont | undefined => byFamily.get(firstFamily(stack).toLowerCase());

const FAMILY_TOKENS = ["fontFamilyPrimary", "fontFamilySecondary", "fontFamilyText", "fontFamilyAccent", "fontFamilyMono"] as const;
// Alleen deze twee worden vooraf gedownload: de rest zit meestal niet boven de vouw of is niet in gebruik.
const PRELOAD_TOKENS = ["fontFamilyPrimary", "fontFamilyText"] as const;

/** De webfonts die een thema nodig heeft, en welke daarvan vooraf moeten worden geladen. */
export function themeFonts(theme: SiteTheme): { used: WebFont[]; preload: WebFont[] } {
  const merged = { ...defaultTheme, ...theme };
  const pick = (tokens: readonly (typeof FAMILY_TOKENS)[number][]) => [...new Set(tokens.map((t) => webFontFor(merged[t])).filter((f): f is WebFont => !!f))];
  return { used: pick(FAMILY_TOKENS), preload: pick(PRELOAD_TOKENS) };
}

export const fontUrl = (f: WebFont) => `${FONT_DIR}/${f.file}`;

/** De @font-face-regels voor deze webfonts. `swap`: tekst is meteen leesbaar in het terugvalfont en wisselt zodra het bestand er is. */
export function fontFaceCss(fonts: readonly WebFont[]): string {
  return fonts
    .map((f) => `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weights};font-display:swap;src:url(${fontUrl(f)}) format("woff2")}`)
    .join("");
}
