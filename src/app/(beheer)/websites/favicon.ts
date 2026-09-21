"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { deleteMediaFiles, faviconId, MAX_UPLOAD_BYTES, MediaError, storeFavicon } from "@/lib/media";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import type { Result } from "./actions";

// Het favicon van een website. De wijziging staat in de werkkopie en gaat pas online bij het volgende publiceren, zoals de rest van de site
// (het favicon zit in de momentopname: zie loadWorkingSnapshot).

const NO_SITE = "Deze website bestaat niet (meer).";

/** Ruimt de bestanden van een eerder favicon op. Mislukt dat, dan blijven ze verweesd in R2 staan; de site zelf verandert er niet door. */
async function removeOld(siteId: string, url: string | null) {
  const id = url ? faviconId(url) : null;
  if (id) await deleteMediaFiles(siteId, id).catch((e) => console.error("Oud favicon opruimen mislukt:", e instanceof Error ? e.message : e));
}

/** Uploadt een favicon (veld `file`), verkleint hem tot 32 en 180 px en zet hem bij de website. Vervangt een eerder favicon. */
export async function uploadFavicon(siteId: string, formData: FormData): Promise<Result<{ url: string }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!z.uuid().safeParse(siteId).success) return { ok: false, error: NO_SITE };
  const [site] = await db.select({ id: sites.id, faviconUrl: sites.faviconUrl }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: NO_SITE };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Kies een afbeelding om te uploaden." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: `Het bestand is te groot (maximaal ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).` };

  let stored;
  try {
    stored = await storeFavicon(Buffer.from(await file.arrayBuffer()), site.id);
  } catch (e) {
    if (e instanceof MediaError) return { ok: false, error: e.message };
    console.error("Favicon uploaden mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Uploaden is mislukt. Probeer het opnieuw." };
  }

  await db.update(sites).set({ faviconUrl: stored.url, updatedAt: new Date() }).where(eq(sites.id, site.id));
  await removeOld(site.id, site.faviconUrl);
  return { ok: true, url: stored.url };
}

/** Haalt het geüploade favicon weg; de website krijgt dan weer het automatische icoon in zijn merkkleur. */
export async function removeFavicon(siteId: string): Promise<Result> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!z.uuid().safeParse(siteId).success) return { ok: false, error: NO_SITE };
  const [site] = await db.select({ faviconUrl: sites.faviconUrl }).from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: NO_SITE };
  await db.update(sites).set({ faviconUrl: null, updatedAt: new Date() }).where(eq(sites.id, siteId));
  await removeOld(siteId, site.faviconUrl);
  return { ok: true };
}
