import { asc, and, eq } from "drizzle-orm";
import { db } from "@/db";
import { pages, sites, siteVersions, type SiteSnapshot } from "@/db/schema";
import { hashSnapshot } from "@/lib/snapshot";
import { parseSections } from "./sections";

// Hulpfuncties voor publiceren (alleen op de server). De acties zelf staan in publish.ts.

/** Zoveel versies per site bewaren we; oudere worden bij het publiceren opgeruimd. */
export const KEEP_VERSIONS = 20;

/**
 * De werkkopie van een site als momentopname. Elke sectie wordt gevalideerd en genormaliseerd (defaults ingevuld), zodat
 * wat we bewaren altijd rendert en dezelfde inhoud altijd dezelfde hash geeft, ook na een schema-uitbreiding van een block.
 */
export async function loadWorkingSnapshot(siteId: string): Promise<{ ok: true; snapshot: SiteSnapshot; hash: string } | { ok: false; error: string }> {
  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));
  if (!site) return { ok: false, error: "Deze website bestaat niet meer." };
  const rows = await db.select().from(pages).where(eq(pages.siteId, siteId)).orderBy(asc(pages.position), asc(pages.createdAt));
  if (!rows.some((p) => p.slug === "")) return { ok: false, error: "De website heeft geen homepagina." };

  const outPages: SiteSnapshot["pages"] = [];
  for (const [index, p] of rows.entries()) {
    const parsed = parseSections(p.content);
    if (!parsed.ok) return { ok: false, error: `Pagina "${p.title}": ${parsed.error}` };
    outPages.push({
      slug: p.slug,
      title: p.title,
      position: index,
      sections: parsed.sections,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      ogImage: p.ogImage,
      noindex: p.noindex,
    });
  }

  const header = parseSections(site.layout.header, { kind: "slot", slot: "header" });
  if (!header.ok) return { ok: false, error: `Header: ${header.error}` };
  const footer = parseSections(site.layout.footer, { kind: "slot", slot: "footer" });
  if (!footer.ok) return { ok: false, error: `Footer: ${footer.error}` };

  const snapshot: SiteSnapshot = {
    name: site.name,
    theme: site.theme,
    layout: { header: header.sections, footer: footer.sections },
    pages: outPages,
  };
  return { ok: true, snapshot, hash: hashSnapshot(snapshot) };
}

export type PublishInfo = {
  /** Staat de site nu online? */
  live: boolean;
  /** Versienummer dat live staat (of het laatst live stond); null als er nooit gepubliceerd is. */
  version: number | null;
  /** Wijkt de werkkopie af van de live versie? Bij een site die niet live staat altijd waar. */
  changed: boolean;
};

export async function getPublishInfo(siteId: string): Promise<PublishInfo> {
  const [site] = await db.select({ status: sites.status, publishedVersion: sites.publishedVersion }).from(sites).where(eq(sites.id, siteId));
  const live = site?.status === "live" && site.publishedVersion !== null;
  if (!site || !live) return { live: false, version: site?.publishedVersion ?? null, changed: true };

  const [version] = await db
    .select({ hash: siteVersions.contentHash })
    .from(siteVersions)
    .where(and(eq(siteVersions.siteId, siteId), eq(siteVersions.version, site.publishedVersion!)));
  const working = await loadWorkingSnapshot(siteId);
  return { live: true, version: site.publishedVersion, changed: !working.ok || !version || working.hash !== version.hash };
}
