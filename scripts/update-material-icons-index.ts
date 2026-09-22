// Ververst de doorzoekbare iconennaam-index (src/lib/material-icons-index.json). Draai dit handmatig en incidenteel
// (niet bij elke build/deploy): `npx tsx scripts/update-material-icons-index.ts`.
//
// Bron: de bestandslijst van het open-source npm-pakket @material-symbols/svg-400 (Apache 2.0), via jsDelivr's
// publieke, sleutelloze metadata-API. Alleen de "outlined"-stijl, gewicht 400, fill 0 (geen variabele assen in v1) —
// dezelfde stijl die src/lib/material-icons.ts ophaalt. Dit script schrijft alleen namen naar de repo, geen SVG's;
// de echte iconen worden pas opgehaald zodra een medewerker er één kiest (zie src/lib/material-icons.ts).
//
// Bij het verversen: het vastgepinde versienummer hieronder moet gelijk blijven aan MATERIAL_ICONS_VERSION in
// src/lib/material-icons.ts (die haalt bestanden van hetzelfde, vastgepinde pad op).
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const VERSION = "0.47.4";
const SOURCE_URL = `https://data.jsdelivr.com/v1/package/npm/@material-symbols/svg-400@${VERSION}/flat`;
const OUT_FILE = join(__dirname, "../src/lib/material-icons-index.json");

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Bestandslijst ophalen mislukt: HTTP ${res.status}`);
  const data = (await res.json()) as { files: { name: string }[] };

  const names = data.files
    .filter((f) => f.name.startsWith("/outlined/") && f.name.endsWith(".svg") && !f.name.endsWith("-fill.svg"))
    .map((f) => f.name.slice("/outlined/".length, -".svg".length))
    .sort();

  writeFileSync(OUT_FILE, JSON.stringify(names, null, 0) + "\n");
  console.log(`${names.length} iconen geschreven naar ${OUT_FILE} (pakketversie ${VERSION})`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
