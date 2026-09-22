import { isKnownIconName } from "./material-icons-index";

// Material Symbols-iconen on-demand: een icoon wordt pas opgehaald als een medewerker het voor het eerst kiest (nu
// alleen in usp-grid), en staat daarna voorgoed zelf gehost in de tabel `hosted_icons` (geen R2 nodig: een gesaneerde
// SVG past ruim in een tekstkolom). Alleen op de server (de doorzoekbare naamindex zelf staat in
// ./material-icons-index.ts, dat client-componenten ook mogen importeren).
//
// Bron: het open-source npm-pakket @material-symbols/svg-400 (Apache 2.0), via een vastgepind pad+versie op
// jsDelivr. Alleen de "outlined"-stijl, gewicht 400, fill 0 (geen variabele assen in v1). De gebundelde naamindex
// (material-icons-index.json, ververst via scripts/update-material-icons-index.ts) is de allowlist: er wordt nooit
// een door de gebruiker verzonnen naam opgehaald.
//
// Sanering: geen allowlist-parser op willekeurige opmaak, maar een volledige herbouw uit gevalideerde onderdelen —
// alleen `viewBox` en `d`-waarden die een strikte tekenset doorstaan worden ooit in de uitvoer gezet. Zo kan er nooit
// iets anders dan een <svg><path/></svg> uit komen, ongeacht wat de bron teruggeeft.

const VERSION = "0.47.4"; // moet gelijk blijven aan VERSION in scripts/update-material-icons-index.ts
const CDN_HOST = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400@${VERSION}/outlined/`;
const TIMEOUT_MS = 8_000;
const MAX_SVG_BYTES = 20_000;

export class IconError extends Error {}

const VIEWBOX_RE = /^[\d.\s-]+$/;
const PATH_D_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

/**
 * Bouwt een veilige SVG opnieuw op uit alleen gevalideerde onderdelen (viewBox + path-data). Gooit een fout als de
 * bron niet exact de verwachte vorm heeft — liever weigeren dan iets ongefilterds doorlaten.
 */
export function sanitizeSvg(raw: string): string {
  const svgMatch = raw.match(/<svg\b[^>]*\bviewBox="([^"]*)"[^>]*>([\s\S]*)<\/svg>\s*$/i);
  if (!svgMatch) throw new IconError("Onverwachte SVG-vorm.");
  const [, viewBox, inner] = svgMatch;
  if (!VIEWBOX_RE.test(viewBox.trim())) throw new IconError("Onverwachte viewBox.");

  const paths: string[] = [];
  const pathRe = /<path\b[^>]*\bd="([^"]*)"[^>]*\/>/gi;
  let match: RegExpExecArray | null;
  let consumed = 0;
  while ((match = pathRe.exec(inner))) {
    if (match.index !== consumed) throw new IconError("Onverwachte inhoud tussen de paden.");
    const d = match[1].trim();
    if (!PATH_D_RE.test(d)) throw new IconError("Onverwachte tekens in het pad.");
    paths.push(d);
    consumed = pathRe.lastIndex;
  }
  if (paths.length === 0 || consumed !== inner.length) throw new IconError("Onverwachte SVG-vorm.");

  return `<svg viewBox="${viewBox.trim()}" fill="currentColor">${paths.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
}

/** Haalt een Material Symbol op (alleen als de naam in de gebundelde index staat) en geeft de gesaneerde SVG terug. */
export async function fetchAndSanitizeIcon(name: string): Promise<string> {
  if (!isKnownIconName(name)) throw new IconError("Onbekend icoon.");

  let text: string;
  try {
    const res = await fetch(`${CDN_HOST}${name}.svg`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    text = await res.text();
  } catch (e) {
    console.error("Icoon ophalen mislukt:", e instanceof Error ? e.message : e);
    throw new IconError("Ophalen is mislukt. Probeer het opnieuw.");
  }
  if (text.length > MAX_SVG_BYTES) throw new IconError("Bestand te groot.");

  return sanitizeSvg(text);
}
