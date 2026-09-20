import { eq, sql } from "drizzle-orm";
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

/** De slugs van alle pagina's die een site ooit in een bewaarde versie had (ook verwijderde, die kunnen nog in de cache staan). "" is de homepage. */
async function pageSlugs(siteId: string): Promise<string[]> {
  const res = await db.execute<{ slug: string | null }>(
    sql`select distinct p->>'slug' as slug from site_versions v, jsonb_array_elements(v.snapshot->'pages') p where v.site_id = ${siteId}`,
  );
  return [...new Set(["", ...res.rows.map((r) => r.slug ?? "")])];
}

/**
 * Laat de openbare pagina's van een site bij het volgende bezoek opnieuw opbouwen, onder elke host van de site.
 * `extra`: hosts die net zijn weggehaald maar nog in de cache kunnen staan.
 *
 * Een gecachete pagina krijgt twee soorten tags: die van het routepatroon (gelden voor álle sites) en die van het exacte pad
 * (/s/<host>/<pagina>, zonder "/layout"). Alleen de laatste is per site. Daarom per host en pagina een letterlijk pad zonder `type`:
 * met `type: "layout"` past de tag bij geen enkele pagina en gebeurt er niets (zo bleef een gepubliceerde wijziging onzichtbaar).
 * En het doelpad, niet het adres in de adresbalk: zie de documentatie van revalidatePath bij rewrites.
 */
export async function revalidatePublicSite(site: { id: string; slug: string }, extra: string[] = []) {
  const [hosts, slugs] = await Promise.all([siteHostnames(site, extra), pageSlugs(site.id)]);
  for (const host of hosts) {
    for (const slug of slugs) revalidatePath(`/s/${encodeURIComponent(host)}${slug === "" ? "" : `/${slug}`}`);
  }
  revalidatePath("/websites");
}
