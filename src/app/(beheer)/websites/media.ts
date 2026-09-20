"use server";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { media, pages, sites } from "@/db/schema";
import { deleteMediaFiles } from "@/lib/media";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";
import type { Result } from "./actions";

export type MediaItem = {
  id: string;
  url: string;
  srcset: string;
  width: number;
  height: number;
  filename: string | null;
  bytes: number;
  createdAt: string;
  /** Aantal opgeslagen plekken (pagina's, header/footer) waar dit beeld nu in staat. */
  usedIn: number;
};

const uuid = z.uuid();
const MAX_ITEMS = 200;

/**
 * Per beeld het aantal opgeslagen plekken waar het in voorkomt. Het `id` staat in elke URL, dus zoeken in de JSON van de
 * pagina's en de sitebrede secties volstaat. Alleen opgeslagen gegevens tellen mee; de builder houdt zelf bij wat er open staat.
 */
async function usageByMedia(siteId: string, ids: string[]): Promise<Map<string, number>> {
  const [pageRows, [site]] = await Promise.all([
    db.select({ content: pages.content, ogImage: pages.ogImage }).from(pages).where(eq(pages.siteId, siteId)),
    db.select({ layout: sites.layout }).from(sites).where(eq(sites.id, siteId)),
  ]);
  const places = [...pageRows.map((p) => JSON.stringify(p.content) + (p.ogImage ?? "")), JSON.stringify(site?.layout ?? {})];
  return new Map(ids.map((id) => [id, places.filter((text) => text.includes(id)).length]));
}

/** De nieuwste beelden van één website (maximaal 200), met waar ze gebruikt worden. */
export async function listMedia(siteId: string): Promise<Result<{ items: MediaItem[] }>> {
  if (!(await staffUser())) return { ok: false, error: NOT_LOGGED_IN };
  if (!uuid.safeParse(siteId).success) return { ok: false, error: "Deze website bestaat niet (meer)." };
  const rows = await db.select().from(media).where(eq(media.siteId, siteId)).orderBy(desc(media.createdAt)).limit(MAX_ITEMS);
  const usage = await usageByMedia(
    siteId,
    rows.map((r) => r.id),
  );
  return {
    ok: true,
    items: rows.map((r) => ({
      id: r.id,
      url: r.url,
      srcset: r.srcset,
      width: r.width,
      height: r.height,
      filename: r.filename,
      bytes: r.bytes,
      createdAt: r.createdAt.toISOString(),
      usedIn: usage.get(r.id) ?? 0,
    })),
  };
}

/** Verwijdert een beeld en al zijn bestanden. Alleen een platform-admin, en alleen als het nergens meer in gebruik is. */
export async function deleteMedia(siteId: string, mediaId: string): Promise<Result> {
  const user = await staffUser();
  if (!user) return { ok: false, error: NOT_LOGGED_IN };
  if (user.role !== "platform-admin") return { ok: false, error: "Alleen een platform-admin mag verwijderen." };
  if (!uuid.safeParse(siteId).success || !uuid.safeParse(mediaId).success) return { ok: false, error: "Dit beeld bestaat niet (meer)." };

  const [row] = await db.select({ id: media.id }).from(media).where(and(eq(media.id, mediaId), eq(media.siteId, siteId)));
  if (!row) return { ok: false, error: "Dit beeld bestaat niet (meer)." };

  const used = (await usageByMedia(siteId, [mediaId])).get(mediaId) ?? 0;
  if (used > 0) return { ok: false, error: `Dit beeld wordt nog gebruikt (${used}×). Haal het eerst uit de pagina('s).` };

  // Eerst de bestanden, dan de rij: mislukt het wissen, dan blijft het beeld zichtbaar en kan het opnieuw.
  try {
    await deleteMediaFiles(siteId, mediaId);
  } catch (e) {
    console.error("Bestanden verwijderen mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Verwijderen uit de opslag is mislukt. Probeer het opnieuw." };
  }
  await db.delete(media).where(eq(media.id, mediaId));
  return { ok: true };
}
