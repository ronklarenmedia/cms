import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/db";
import { siteDomains } from "@/db/schema";
import { liveTag } from "./public-site";
import { previewHost } from "./site-hosts";

// Hulpfuncties voor de hostnamen van een site. Alleen op de server.

/** Alle hosts waaronder een site bereikbaar is: het voorbeeldadres en de eigen domeinen. */
export async function siteHostnames(site: { id: string; slug: string }, extra: string[] = []): Promise<string[]> {
  const rows = await db.select({ hostname: siteDomains.hostname }).from(siteDomains).where(eq(siteDomains.siteId, site.id));
  const preview = previewHost(site.slug);
  return [...new Set([...(preview ? [preview] : []), ...rows.map((r) => r.hostname), ...extra])];
}

/**
 * Laat de openbare pagina's van een site bij het volgende bezoek opnieuw opbouwen, onder elke host van de site.
 * `extra`: hosts die net zijn weggehaald maar nog in de cache kunnen staan.
 *
 * Per host één tag (zie liveTag in public-site.ts); `updateTag` laat hem direct verlopen, dus geen verouderde pagina na het publiceren.
 * `updateTag` werkt alleen in een server-actie: alle aanroepers zijn dat. (Met `revalidatePath` lukt het niet: de pagina's zijn een
 * route-handler achter een rewrite, waarvan het pad-tag voor elke site hetzelfde is.)
 */
export async function revalidatePublicSite(site: { id: string; slug: string }, extra: string[] = []) {
  for (const host of await siteHostnames(site, extra)) updateTag(liveTag(host));
  revalidatePath("/websites");
}
