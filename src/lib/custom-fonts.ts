import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import type { FontWeight } from "./custom-fonts-index";
import { getR2Config, type R2Config } from "./r2";

// Eigen (door de klant aangeleverde) lettertypebestanden: geen derde partij, alleen een upload die direct in R2
// wordt gezet — onder hetzelfde pad als on-demand Google Fonts (src/app/fonts/g/[file]/route.ts serveert ze allebei,
// dezelfde `hosted_fonts`-tabel bewaart ze allebei). Alleen .woff2: één breed ondersteund, modern formaat, geen
// legacy-formaten (TTF/OTF/WOFF1) die een aparte conversie zouden vragen. Gevalideerd op de echte bestandsbytes
// (magic number), niet op de bestandsnaam of het opgegeven type. De weight-lijst zelf staat in ./custom-fonts-index
// (client-veilig; dit bestand importeert node:crypto en aws4fetch en mag dus nooit in een clientbundel belanden).

export class CustomFontError extends Error {}

/** Zelfde grens als een on-demand opgehaalde Google Font (src/lib/google-fonts.ts). */
const MAX_FONT_BYTES = 2 * 1024 * 1024;
const WOFF2_MAGIC = Buffer.from([0x77, 0x4f, 0x46, 0x32]); // "wOF2"

const objectUrl = (config: R2Config, key: string) => `${config.endpoint}/${config.bucket}/${key}`;
const client = (config: R2Config) => new AwsClient({ accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, service: "s3", region: "auto" });

/**
 * Zet één gewicht van een zelf geüpload lettertype in R2. `existingId` hergebruikt de map van een familie die al
 * gehost wordt (een extra gewicht toevoegen); zonder id wordt er een nieuwe gemaakt.
 */
export async function storeCustomFontFile(existingId: string | null, weight: FontWeight, buf: Buffer): Promise<{ id: string; path: string }> {
  if (buf.length < 4 || !buf.subarray(0, 4).equals(WOFF2_MAGIC)) throw new CustomFontError("Alleen .woff2-bestanden worden ondersteund.");
  if (buf.length > MAX_FONT_BYTES) throw new CustomFontError(`Het bestand is te groot (maximaal ${MAX_FONT_BYTES / 1024 / 1024} MB).`);

  const config = getR2Config();
  if (!config?.publicUrl) throw new CustomFontError("Opslag is nog niet ingesteld. Controleer Instellingen → Koppelingen.");

  const id = existingId ?? randomUUID();
  const path = `${id}/${weight}.woff2`;
  const key = `fonts/g/${path}`;
  const r2 = client(config);
  const res = await r2.fetch(objectUrl(config, key), {
    method: "PUT",
    body: new Uint8Array(buf),
    headers: { "content-type": "font/woff2", "cache-control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) {
    console.error("Eigen lettertype opslaan mislukt: R2 antwoordde met status", res.status);
    throw new CustomFontError("Opslaan is mislukt. Probeer het opnieuw.");
  }
  return { id, path };
}
