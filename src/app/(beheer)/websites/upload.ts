"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { media, sites } from "@/db/schema";
import { deleteMediaFiles, MAX_UPLOAD_BYTES, MediaError, storeImage, type StoredImage } from "@/lib/media";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import type { Result } from "./actions";

/** Alleen de bestandsnaam zelf, zonder pad of stuurtekens, begrensd op de kolomlengte. */
const cleanFilename = (name: string) =>
  [...name.replace(/^.*[\\/]/, "")]
    .filter((ch) => (ch.codePointAt(0) ?? 0) >= 32 && ch !== "\u007f")
    .join("")
    .trim()
    .slice(0, 255) || null;

/**
 * Uploadt één afbeelding voor een website (veld `file` in het formulier), legt haar vast in de mediabibliotheek en geeft
 * de gegevens voor het `image`-veld terug.
 */
export async function uploadImage(siteId: string, formData: FormData): Promise<Result<{ image: StoredImage }>> {
  const user = await staffUser();
  if (!user) return { ok: false, error: NOT_LOGGED_IN };
  if (!z.uuid().safeParse(siteId).success) return { ok: false, error: "Deze website bestaat niet (meer)." };
  const [site] = await db.select({ id: sites.id }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet (meer)." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Kies een afbeelding om te uploaden." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: `Het bestand is te groot (maximaal ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).` };

  let image: StoredImage;
  try {
    image = await storeImage(Buffer.from(await file.arrayBuffer()), `sites/${site.id}`);
  } catch (e) {
    if (e instanceof MediaError) return { ok: false, error: e.message };
    console.error("Upload mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Uploaden is mislukt. Probeer het opnieuw." };
  }

  try {
    await db.insert(media).values({
      id: image.id,
      siteId: site.id,
      url: image.url,
      srcset: image.srcset,
      width: image.width,
      height: image.height,
      filename: cleanFilename(file.name),
      bytes: image.bytes,
      createdBy: user.id,
    });
  } catch (e) {
    // Zonder rij is het bestand onvindbaar in de bibliotheek; liever niets laten liggen.
    console.error("Vastleggen in de mediabibliotheek mislukt:", e instanceof Error ? e.message : e);
    await deleteMediaFiles(site.id, image.id).catch(() => {});
    return { ok: false, error: "Uploaden is mislukt. Probeer het opnieuw." };
  }
  return { ok: true, image };
}
