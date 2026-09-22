import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import type { HostedFont } from "@/db/schema";
import { findInFontsIndex } from "./google-fonts-index";
import { getR2Config, type R2Config } from "./r2";

// Google Fonts on-demand: een lettertype wordt pas opgehaald als een medewerker het voor het eerst kiest, en staat
// daarna voorgoed zelf gehost (src/app/fonts/g/[...file]/route.ts), net als geüploade afbeeldingen/favicons via R2.
// Alleen op de server (de doorzoekbare index zelf staat in ./google-fonts-index.ts, dat client-componenten ook mogen
// importeren). Dit is de eerste echte derde-partij-verbinding in de codebase; de gebundelde index is de allowlist: er
// wordt nooit een door de gebruiker verzonnen naam of URL opgehaald, alleen een familie die al in de index staat.
// Elke `url()` uit Google's eigen CSS-antwoord wordt bovendien opnieuw tegen de toegestane host gevalideerd vóór hij
// wordt opgehaald.

const CSS_HOST = "https://fonts.googleapis.com/css2";
const FILE_HOST = /^https:\/\/fonts\.gstatic\.com\//;
const TIMEOUT_MS = 10_000;
/** Ruim boven de grootste bestaande variabele lettertypes (enkele honderden KB); beschermt tegen een onverwacht groot antwoord. */
const MAX_FILE_BYTES = 2 * 1024 * 1024;
// Een "moderne" user-agent is nodig, anders levert Google EOT/TTF voor oude browsers in plaats van woff2.
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export class GoogleFontError extends Error {}

const objectUrl = (config: R2Config, key: string) => `${config.endpoint}/${config.bucket}/${key}`;
const client = (config: R2Config) => new AwsClient({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, service: "s3", region: "auto" });

async function deleteObjects(config: R2Config, keys: string[]) {
  const r2 = client(config);
  await Promise.allSettled(keys.map((key) => r2.fetch(objectUrl(config, key), { method: "DELETE" })));
}

/** De `/* latin *\/`-@font-face-blokken uit Google's CSS2-antwoord: één per gewicht (of één in totaal bij een variabel lettertype). */
function parseLatinFontFaces(css: string): { weight: string; url: string }[] {
  const out: { weight: string; url: string }[] = [];
  const re = /\/\*\s*latin\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  for (const m of css.matchAll(re)) {
    const weight = m[1].match(/font-weight:\s*([\d\s]+);/)?.[1]?.trim();
    const url = m[1].match(/src:\s*url\(([^)]+)\)/)?.[1]?.trim();
    if (weight && url) out.push({ weight, url });
  }
  return out;
}

/**
 * Haalt een Google Font op (alleen als de familie in de gebundelde index staat), zet hem in R2 onder een globale
 * (niet per site) sleutel en geeft de rij terug die in `hosted_fonts` moet worden ingevoegd. Bij een gedeeltelijke
 * fout worden de al geschreven bestanden weer opgeruimd.
 */
export async function fetchAndStoreFont(family: string): Promise<Omit<HostedFont, "createdAt" | "createdBy">> {
  const entry = findInFontsIndex(family);
  if (!entry) throw new GoogleFontError("Onbekend lettertype.");

  const config = getR2Config();
  if (!config?.publicUrl) throw new GoogleFontError("Opslag is nog niet ingesteld. Controleer Instellingen → Koppelingen.");

  const cssUrl = `${CSS_HOST}?family=${encodeURIComponent(entry.family).replace(/%20/g, "+")}:wght@${entry.wght}&display=swap`;
  let css: string;
  try {
    const res = await fetch(cssUrl, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    css = await res.text();
  } catch (e) {
    console.error("Google Fonts CSS ophalen mislukt:", e instanceof Error ? e.message : e);
    throw new GoogleFontError("Lettertype ophalen is mislukt. Probeer het opnieuw.");
  }

  const faces = parseLatinFontFaces(css).filter((f) => FILE_HOST.test(f.url));
  if (faces.length === 0) throw new GoogleFontError("Geen bruikbaar lettertypebestand gevonden.");

  const id = randomUUID();
  // `url` is hier het pad ná "/fonts/g/" (dus ook de R2-sleutel ná "fonts/g/"): zowel de serveerroute
  // (src/app/fonts/g/[...file]/route.ts) als deze functie leiden er hun volledige pad uit af, in plaats van de
  // R2-basis-URL in de database vast te leggen.
  const files: { weight: string; url: string }[] = [];
  const keys: string[] = [];
  const r2 = client(config);
  try {
    for (const face of faces) {
      const fileRes = await fetch(face.url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!fileRes.ok) throw new Error(`status ${fileRes.status}`);
      const buf = new Uint8Array(await fileRes.arrayBuffer());
      if (buf.byteLength > MAX_FILE_BYTES) throw new Error("bestand te groot");

      const path = `${id}/${face.weight.replace(/\s+/g, "-")}.woff2`;
      const key = `fonts/g/${path}`;
      const putRes = await r2.fetch(objectUrl(config, key), {
        method: "PUT",
        body: buf,
        headers: { "content-type": "font/woff2", "cache-control": "public, max-age=31536000, immutable" },
      });
      if (!putRes.ok) throw new Error(`R2 antwoordde met status ${putRes.status}`);
      keys.push(key);
      files.push({ weight: face.weight, url: path });
    }
  } catch (e) {
    await deleteObjects(config, keys);
    console.error("Google Font opslaan mislukt:", e instanceof Error ? e.message : e);
    throw new GoogleFontError("Opslaan is mislukt. Probeer het opnieuw.");
  }

  return { id, family: entry.family, category: entry.category, files };
}
