import { defaultTheme, type SiteTheme, type ThemeToken } from "@/blocks/theme";

// Indeling, labels en validatie van de ~87 thema-tokens voor de design-kit-editor. Geen server-code: ook in de browser te gebruiken.

export type TokenKind = "color" | "number" | "text";
export type TokenGroup = { id: string; label: string; description: string; tokens: ThemeToken[] };

export const TOKENS = Object.keys(defaultTheme) as ThemeToken[];
export const isToken = (name: string): name is ThemeToken => Object.prototype.hasOwnProperty.call(defaultTheme, name);

const PREFIXES = [
  ["fontSize", "Tekstgrootte"],
  ["fontFamily", "Lettertype"],
  ["fontWeight", "Tekstdikte"],
  ["lineHeight", "Regelhoogte"],
  ["letterSpacing", "Letterafstand"],
  ["borderRadius", "Hoekafronding"],
  ["borderWidth", "Randdikte"],
  ["boxShadow", "Schaduw"],
  ["spacing", "Ruimte"],
  ["maxWidth", "Maximale breedte"],
  ["aspectRatio", "Beeldverhouding"],
  ["transition", "Overgang"],
  ["opacity", "Doorzichtigheid"],
  ["zIndex", "Laag"],
  ["color", "Kleur"],
] as const;

const WORDS: Record<string, string> = {
  Xs: "XS",
  Small: "klein",
  Standard: "standaard",
  Medium: "middel",
  Large: "groot",
  Xl: "XL",
  Xxl: "XXL",
  Light: "licht",
  Dark: "donker",
  Bold: "vet",
  Heavy: "zwaar",
  Tight: "strak",
  Relaxed: "ruim",
  Loose: "los",
  Wide: "wijd",
  None: "geen",
  Full: "volledig",
  Thin: "dun",
  Thick: "dik",
  Fast: "snel",
  Slow: "traag",
  Solid: "dicht",
  Primary: "primair",
  Secondary: "secundair",
  Text: "tekst",
  Accent: "accent",
  Mono: "vaste breedte",
  Success: "succes",
  Warning: "waarschuwing",
  Error: "fout",
  Square: "vierkant",
  Video: "video",
  Photo: "foto",
  Portrait: "portret",
  Base: "basis",
  Above: "boven",
  Dropdown: "uitklapmenu",
  Overlay: "overlay",
  Modal: "venster",
  Bg: "achtergrond",
  White: "wit",
  OffWhite: "gebroken wit",
  LightGrey: "lichtgrijs",
  MediumGrey: "middengrijs",
  DarkGrey: "donkergrijs",
  OffBlack: "gebroken zwart",
  Black: "zwart",
};

const words = (rest: string) => rest.match(/[A-Z][a-z]*|[0-9]+/g) ?? [];

/** "fontSizeXs" → "Tekstgrootte XS"; "colorBgPrimaryLight" → "Kleur achtergrond primair licht". */
export function tokenLabel(token: ThemeToken): string {
  const [prefix, nl] = PREFIXES.find(([p]) => token.startsWith(p)) ?? [token, token];
  const rest = token.slice(prefix.length);
  // Samengestelde kleurnamen eerst als geheel vertalen (OffWhite, LightGrey, …).
  const whole = WORDS[rest];
  const text = whole ?? words(rest).map((w) => WORDS[w] ?? w.toLowerCase()).join(" ");
  return text ? `${nl} ${text}` : nl;
}

export function tokenKind(token: ThemeToken): TokenKind {
  if (token.startsWith("color")) return "color";
  if (token.startsWith("opacity") || token.startsWith("zIndex")) return "number";
  return "text";
}

const COLOR_GROUPS: { id: string; label: string; test: (t: string) => boolean }[] = [
  { id: "merk", label: "Merkkleuren", test: (t) => ["colorPrimary", "colorSecondary", "colorAccent", "colorText"].includes(t) },
  { id: "achtergronden", label: "Achtergronden", test: (t) => t.startsWith("colorBgPrimary") || t.startsWith("colorBgSecondary") },
  { id: "neutraal", label: "Neutrale kleuren", test: (t) => ["colorWhite", "colorOffWhite", "colorLightGrey", "colorMediumGrey", "colorDarkGrey", "colorOffBlack", "colorBgBlack"].includes(t) },
  { id: "status", label: "Statuskleuren", test: (t) => ["colorSuccess", "colorWarning", "colorError"].includes(t) },
];

const BASIC_GROUPS: { id: string; label: string; description: string; test: (t: string) => boolean }[] = [
  { id: "tekst", label: "Typografie", description: "Lettertypes, groottes, diktes en regelafstand. Bij een lettertype kies je een webfont (zelf gehost, wordt meegeleverd) of een systeemlettertype.", test: (t) => /^(fontSize|fontFamily|fontWeight|lineHeight|letterSpacing)/.test(t) },
  { id: "vorm", label: "Vormgeving", description: "Hoeken, randen en schaduwen.", test: (t) => /^(borderRadius|borderWidth|boxShadow)/.test(t) },
  { id: "ruimte", label: "Ruimte en afmetingen", description: "Witruimte en maximale breedtes.", test: (t) => /^(spacing|maxWidth)/.test(t) },
  { id: "media", label: "Media", description: "Beeldverhoudingen.", test: (t) => t.startsWith("aspectRatio") },
  { id: "interactie", label: "Interactie en lagen", description: "Overgangen, doorzichtigheid en stapelvolgorde.", test: (t) => /^(transition|opacity|zIndex)/.test(t) },
];

/** De tokens, gegroepeerd voor de editor; de volgorde binnen een groep is die van `defaultTheme`. */
export const TOKEN_GROUPS: TokenGroup[] = [
  ...COLOR_GROUPS.map((g) => ({ id: g.id, label: g.label, description: "", tokens: TOKENS.filter((t) => g.test(t)) })),
  ...BASIC_GROUPS.map((g) => ({ id: g.id, label: g.label, description: g.description, tokens: TOKENS.filter((t) => g.test(t)) })),
];

const MAX_LENGTH = 120;
// Geen puntkomma's, accolades, backslashes, hoekhaken of commentaar: een waarde komt in een style-attribuut en mag geen extra declaraties bevatten.
const FORBIDDEN = /[;{}<>\\`]|\/\*|\*\/|url\s*\(|@import|expression\s*\(|javascript:/i;
const COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9.,%\s/deg-]+\)|[a-z]+)$/i;
const FONT = /^[\w\s,'".-]+$/;
const GENERIC = /^[\w\s.,%()#/+*'"-]+$/;

export type ParsedValue = { ok: true; value: string | number } | { ok: false; error: string };

/** Controleert en normaliseert de waarde van één token. `raw` komt uit een invoerveld of uit een opgeslagen kit. */
export function parseTokenValue(token: ThemeToken, raw: unknown): ParsedValue {
  const kind = tokenKind(token);
  if (kind === "number") {
    const n = typeof raw === "number" ? raw : Number(String(raw ?? "").trim().replace(",", "."));
    if (!Number.isFinite(n)) return { ok: false, error: "Vul een getal in." };
    if (token.startsWith("opacity")) return n >= 0 && n <= 1 ? { ok: true, value: n } : { ok: false, error: "Een getal tussen 0 en 1." };
    return Number.isInteger(n) && n >= -1000 && n <= 100000 ? { ok: true, value: n } : { ok: false, error: "Een geheel getal." };
  }
  const value = String(raw ?? "").trim();
  if (!value) return { ok: false, error: "Vul een waarde in." };
  if (value.length > MAX_LENGTH) return { ok: false, error: `Maximaal ${MAX_LENGTH} tekens.` };
  if (FORBIDDEN.test(value)) return { ok: false, error: "Deze waarde bevat tekens die niet zijn toegestaan." };
  if (kind === "color") return COLOR.test(value) ? { ok: true, value } : { ok: false, error: "Een kleur, bijvoorbeeld #4338ca." };
  if (token.startsWith("fontFamily")) return FONT.test(value) ? { ok: true, value } : { ok: false, error: "Alleen letters, cijfers, komma's en aanhalingstekens." };
  return GENERIC.test(value) ? { ok: true, value } : { ok: false, error: "Deze waarde bevat tekens die niet zijn toegestaan." };
}

/** Controleert een hele kit-thema (van een formulier of uit de database) en houdt alleen de geldige afwijkingen van de standaard over. */
export function parseTheme(input: unknown): { ok: true; theme: SiteTheme } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, error: "Ongeldig thema." };
  const theme: Record<string, string | number> = {};
  for (const [key, raw] of Object.entries(input)) {
    if (!isToken(key)) return { ok: false, error: `Onbekend token: ${key}.` };
    const parsed = parseTokenValue(key, raw);
    if (!parsed.ok) return { ok: false, error: `${tokenLabel(key)}: ${parsed.error}` };
    if (String(parsed.value) !== String(defaultTheme[key])) theme[key] = parsed.value;
  }
  return { ok: true, theme: theme as SiteTheme };
}

/** De volledige waarden van een kit: de standaard met de afwijkingen erover. */
export const fullTheme = (theme: SiteTheme): Record<ThemeToken, string | number> => ({ ...defaultTheme, ...theme });
