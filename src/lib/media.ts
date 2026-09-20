import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import sharp from "sharp";
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

export type StoredImage = { url: string; width: number; height: number; srcset: string };

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
    url: urls[top],
    width: variants[top].width,
    height: variants[top].height,
    srcset: variants.map((v, i) => `${urls[i]} ${v.width}w`).join(", "),
  };
}
