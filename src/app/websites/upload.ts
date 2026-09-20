"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { MAX_UPLOAD_BYTES, MediaError, storeImage, type StoredImage } from "@/lib/media";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import type { Result } from "./actions";

/** Uploadt één afbeelding voor een website (veld `file` in het formulier); geeft de gegevens voor het `image`-veld terug. */
export async function uploadImage(siteId: string, formData: FormData): Promise<Result<{ image: StoredImage }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!z.uuid().safeParse(siteId).success) return { ok: false, error: "Deze website bestaat niet (meer)." };
  const [site] = await db.select({ id: sites.id }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet (meer)." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Kies een afbeelding om te uploaden." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: `Het bestand is te groot (maximaal ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).` };

  try {
    return { ok: true, image: await storeImage(Buffer.from(await file.arrayBuffer()), `sites/${site.id}`) };
  } catch (e) {
    if (e instanceof MediaError) return { ok: false, error: e.message };
    console.error("Upload mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Uploaden is mislukt. Probeer het opnieuw." };
  }
}
