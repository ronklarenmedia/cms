import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteDomains } from "@/db/schema";
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
 * `extra`: hosts die net zijn weggehaald maar nog in de cache kunnen staan. `revalidatePath` krijgt het doelpad (/s/<host>), niet het adres in de adresbalk.
 */
export async function revalidatePublicSite(site: { id: string; slug: string }, extra: string[] = []) {
  for (const host of await siteHostnames(site, extra)) revalidatePath(`/s/${encodeURIComponent(host)}`, "layout");
  revalidatePath("/websites");
}
