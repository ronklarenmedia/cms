import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import sharp from "sharp";
import { FAVICON_SIZES } from "./favicon";
import { getR2Config, type R2Config } from "./r2";

// Uploads verwerken en in Cloudflare R2 zetten. Alleen op de server. Van elk beeld maken we WebP-varianten in
// meerdere breedtes (voor `srcset`); de metadata (o.a. GPS in EXIF) wordt weggelaten en de oriëntatie toegepast.

/** Breedtes waarin een beeld wordt opgeslagen; nooit groter dan het origineel (geen opschalen). */
export const MEDIA_WIDTHS = [480, 960, 1600] as const;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
/** Beschermt tegen "decompression bombs": een klein bestand met een gigantisch aantal pixels. */
const MAX_INPUT_PIXELS = 50_000_000;
/** SVG staat er bewust niet bij: dat is uitvoerbare opmaak, geen rasterbeeld. */
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "gif", "avif"]);

/** `id` is de mapnaam in R2 en ook de sleutel van de rij in de tabel `media`; `bytes` is de totale grootte van alle varianten. */
export type StoredImage = { id: string; url: string; width: number; height: number; srcset: string; bytes: number };

/** Een fout met een tekst die aan de gebruiker getoond mag worden. */
export class MediaError extends Error {}

const objectUrl = (config: R2Config, key: string) => `${config.endpoint}/${config.bucket}/${key}`;

function client(config: R2Config) {
  return new AwsClient({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, service: "s3", region: "auto" });
}

async function deleteObjects(config: R2Config, keys: string[]) {
  const r2 = client(config);
  await Promise.allSettled(keys.map((key) => r2.fetch(objectUrl(config, key), { method: "DELETE" })));
}

/** Alle sleutels onder een prefix (ListObjectsV2, met vervolgpagina's). */
async function listKeys(config: R2Config, prefix: string): Promise<string[]> {
  const r2 = client(config);
  const keys: string[] = [];
  let token: string | null = null;
  do {
    const query = new URLSearchParams({ "list-type": "2", prefix, ...(token ? { "continuation-token": token } : {}) });
    const res = await r2.fetch(`${config.endpoint}/${config.bucket}?${query}`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`R2 lijst antwoordde met status ${res.status}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) keys.push(m[1]);
    token = /<IsTruncated>true<\/IsTruncated>/.test(xml) ? (xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1] ?? null) : null;
  } while (token);
  return keys;
}

/**
 * Verwijdert alle bestanden onder `sites/<siteId>/` (of alleen `sites/<siteId>/<mediaId>/`) uit R2.
 * De prefix eindigt altijd op een slash, zodat een andere map met dezelfde beginletters nooit meegaat.
 */
export async function deleteMediaFiles(siteId: string, mediaId?: string): Promise<void> {
  const config = getR2Config();
  if (!config) throw new MediaError("Opslag is niet ingesteld.");
  // Alleen echte uuid's: een lege of vreemde waarde zou een te brede prefix opleveren.
  if (![siteId, mediaId ?? siteId].every((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) {
    throw new Error("Ongeldig id voor het verwijderen van bestanden.");
  }
  const keys = await listKeys(config, `sites/${siteId}/${mediaId ? `${mediaId}/` : ""}`);
  await deleteObjects(config, keys);
}

/**
 * Verkleint en bewaart een afbeelding onder `<folder>/<uuid>/<breedte>.webp` en geeft de openbare URL van de grootste
 * variant terug, plus een `srcset` met alle varianten. De sleutel bevat een uuid en verandert nooit, dus de bestanden
 * mogen onbeperkt gecachet worden.
 */
export async function storeImage(input: Buffer, folder: string): Promise<StoredImage> {
  const config = getR2Config();
  if (!config?.publicUrl) throw new MediaError("Uploaden is nog niet ingesteld. Controleer Instellingen → Koppelingen.");

  const open = () => sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" });

  let format: string | undefined;
  let sourceWidth: number;
  try {
    const meta = await open().metadata();
    format = meta.format;
    // Bij een gedraaide EXIF-oriëntatie (5–8) zijn breedte en hoogte verwisseld ten opzichte van wat je ziet.
    sourceWidth = ((meta.orientation ?? 1) >= 5 ? meta.height : meta.width) ?? 0;
  } catch {
    throw new MediaError("Dit bestand is geen geldige afbeelding, of het is te groot.");
  }
  if (!format || !ACCEPTED_FORMATS.has(format) || sourceWidth <= 0) {
    throw new MediaError("Dit bestandstype wordt niet ondersteund. Gebruik JPG, PNG, WebP, GIF of AVIF.");
  }

  const largest = Math.min(sourceWidth, MEDIA_WIDTHS[MEDIA_WIDTHS.length - 1]);
  const widths = [...MEDIA_WIDTHS.filter((w) => w < largest), largest];

  let variants;
  try {
    variants = await Promise.all(
      widths.map(async (width) => {
        const { data, info } = await open().rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
        return { data, width: info.width, height: info.height };
      }),
    );
  } catch {
    throw new MediaError("Dit beeld kon niet worden verwerkt.");
  }

  const id = randomUUID();
  const keys = variants.map((v) => `${folder}/${id}/${v.width}.webp`);
  const r2 = client(config);
  try {
    await Promise.all(
      variants.map(async (v, i) => {
        const res = await r2.fetch(objectUrl(config, keys[i]), {
          method: "PUT",
          body: new Uint8Array(v.data),
          headers: { "content-type": "image/webp", "cache-control": "public, max-age=31536000, immutable" },
        });
        if (!res.ok) throw new Error(`R2 antwoordde met status ${res.status}`);
      }),
    );
  } catch (e) {
    await deleteObjects(config, keys); // geen halve uploads laten liggen
    console.error("Uploaden naar R2 mislukt:", e instanceof Error ? e.message : e);
    throw new MediaError("Opslaan is mislukt. Probeer het opnieuw.");
  }

  const urls = keys.map((key) => `${config.publicUrl}/${key}`);
  const top = variants.length - 1;
  return {
    id,
    bytes: variants.reduce((sum, v) => sum + v.data.length, 0),
    url: urls[top],
    width: variants[top].width,
    height: variants[top].height,
    srcset: variants.map((v, i) => `${urls[i]} ${v.width}w`).join(", "),
  };
}

/** Onder deze afmeting is een icoon te klein om er iets van te maken. */
const MIN_FAVICON_SIDE = 32;

/** De uuid (mapnaam) van een opgeslagen favicon, uit zijn basis-URL; null als de URL er niet uitziet als een van ons. */
export const faviconId = (baseUrl: string): string | null => baseUrl.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i)?.[1] ?? null;

/**
 * Bewaart een favicon van een site als vierkante PNG's onder `sites/<siteId>/<uuid>/<formaat>.png` en geeft de basis-URL terug
 * (`<publicUrl>/sites/<siteId>/<uuid>`, met daaronder `32.png` en `180.png`). Een niet-vierkant beeld wordt niet bijgesneden maar met een
 * doorzichtige rand aangevuld, zodat een logo compleet blijft. De metadata (o.a. GPS in EXIF) wordt weggelaten. De sleutel bevat een uuid en
 * verandert nooit, dus de bestanden mogen onbeperkt gecachet worden.
 */
export async function storeFavicon(input: Buffer, siteId: string): Promise<{ id: string; url: string }> {
  const config = getR2Config();
  if (!config?.publicUrl) throw new MediaError("Uploaden is nog niet ingesteld. Controleer Instellingen → Koppelingen.");

  const open = () => sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" });
  let format: string | undefined;
  let width = 0;
  let height = 0;
  try {
    const meta = await open().metadata();
    format = meta.format;
    const turned = (meta.orientation ?? 1) >= 5; // een gedraaide EXIF-oriëntatie wisselt breedte en hoogte
    width = (turned ? meta.height : meta.width) ?? 0;
    height = (turned ? meta.width : meta.height) ?? 0;
  } catch {
    throw new MediaError("Dit bestand is geen geldige afbeelding, of het is te groot.");
  }
  if (!format || !ACCEPTED_FORMATS.has(format)) throw new MediaError("Dit bestandstype wordt niet ondersteund. Gebruik JPG, PNG, WebP, GIF of AVIF.");
  if (Math.min(width, height) < MIN_FAVICON_SIDE) throw new MediaError(`Deze afbeelding is te klein (${width} × ${height}). Gebruik minimaal ${MIN_FAVICON_SIDE} × ${MIN_FAVICON_SIDE} pixels, bij voorkeur 180 of groter.`);

  let variants;
  try {
    variants = await Promise.all(
      FAVICON_SIZES.map(async (size) => ({
        size,
        data: await open().rotate().resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer(),
      })),
    );
  } catch {
    throw new MediaError("Deze afbeelding kon niet worden verwerkt.");
  }

  const id = randomUUID();
  const keys = variants.map((v) => `sites/${siteId}/${id}/${v.size}.png`);
  const r2 = client(config);
  try {
    await Promise.all(
      variants.map(async (v, i) => {
        const res = await r2.fetch(objectUrl(config, keys[i]), {
          method: "PUT",
          body: new Uint8Array(v.data),
          headers: { "content-type": "image/png", "cache-control": "public, max-age=31536000, immutable" },
        });
        if (!res.ok) throw new Error(`R2 antwoordde met status ${res.status}`);
      }),
    );
  } catch (e) {
    await deleteObjects(config, keys); // geen halve uploads laten liggen
    console.error("Favicon uploaden naar R2 mislukt:", e instanceof Error ? e.message : e);
    throw new MediaError("Opslaan is mislukt. Probeer het opnieuw.");
  }
  return { id, url: `${config.publicUrl}/sites/${siteId}/${id}` };
}
