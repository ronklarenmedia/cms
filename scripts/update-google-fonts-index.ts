// Ververst de doorzoekbare lettertype-index voor de design-kit-editor (src/lib/google-fonts-index.json). Draai dit
// handmatig en incidenteel (niet bij elke build/deploy): `npx tsx scripts/update-google-fonts-index.ts`.
//
// Bron: Google's eigen, sleutelloze metadata-endpoint dat fonts.google.com/icons zelf gebruikt (hetzelfde soort bron
// als Fontsource, waar de 14 vaste lettertypes in src/lib/fonts.ts al vandaan komen). Dit script draait nooit tijdens
// een build of op een bezoekerspad; alleen de namen/categorieën komen in de repo, geen bestanden. De echte
// lettertypebestanden worden pas opgehaald zodra een medewerker een familie kiest (zie src/lib/google-fonts.ts).
//
// We nemen alleen families met een Latijns subset (dekt Nederlands). "isBrandFont" in Google's eigen metadata blijkt
// gewoon "door Google zelf onderhouden" te betekenen (o.a. Roboto en de hele Noto-familie) en zegt niets over de
// licentie (die is voor alle families in deze index even vrij: OFL/Apache, isOpenSource is altijd waar) — dus dat
// veld wordt hier bewust niet gebruikt om iets uit te sluiten.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_URL = "https://fonts.google.com/metadata/fonts";
const OUT_FILE = join(__dirname, "../src/lib/google-fonts-index.json");

const CATEGORY_MAP: Record<string, string> = {
  "Sans Serif": "sans",
  Serif: "serif",
  Monospace: "mono",
  Display: "display",
  Handwriting: "handwriting",
};

type GoogleFamily = {
  family: string;
  category: string;
  subsets: string[];
  fonts: Record<string, unknown>;
  axes: { tag: string; min: number; max: number }[];
  isOpenSource: boolean;
};

type IndexEntry = {
  family: string;
  category: string;
  /** true = één variabel bestand voor het hele bereik; false = losse bestanden per gewicht. */
  variable: boolean;
  /** Het gewichtsbereik ("100..900") of de losse gewichten ("300;400;700"), voor de CSS2-aanvraag bij het ophalen. */
  wght: string;
};

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Metadata ophalen mislukt: HTTP ${res.status}`);
  const data = (await res.json()) as { familyMetadataList: GoogleFamily[] };

  const entries: IndexEntry[] = [];
  for (const f of data.familyMetadataList) {
    if (!f.isOpenSource) continue;
    if (!f.subsets.includes("latin")) continue;
    const category = CATEGORY_MAP[f.category];
    if (!category) continue;

    const wghtAxis = f.axes.find((a) => a.tag === "wght");
    const weights = Object.keys(f.fonts)
      .filter((w) => !w.endsWith("i")) // geen cursief, zoals de bestaande 14 lettertypes
      .map(Number)
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
    if (weights.length === 0) continue;

    entries.push({
      family: f.family,
      category,
      variable: Boolean(wghtAxis),
      wght: wghtAxis ? `${wghtAxis.min}..${wghtAxis.max}` : weights.join(";"),
    });
  }

  entries.sort((a, b) => a.family.localeCompare(b.family));
  writeFileSync(OUT_FILE, JSON.stringify(entries, null, 0) + "\n");
  console.log(`${entries.length} lettertypes geschreven naar ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
