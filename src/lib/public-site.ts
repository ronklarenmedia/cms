import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { siteDomains, sites, siteVersions, type SiteSnapshot } from "@/db/schema";
import { normalizeHost, slugFromPreviewHost } from "./site-hosts";

// Wat een bezoeker van een gepubliceerde site te zien krijgt: altijd de live versie uit `site_versions`, nooit de werkkopie.

export type PublicSite = {
  id: string;
  slug: string;
  version: number;
  snapshot: SiteSnapshot;
  /** Voorbeeldadres (nooit in zoekmachines) of een eigen domein van de klant. */
  kind: "preview" | "domain";
  /** De host waarop dit verzoek binnenkwam. */
  host: string;
  /** Het primaire domein van de site, alleen als dat klaar voor gebruik is; bezoekers via een ander adres worden daarheen gestuurd. */
  primaryHost: string | null;
};

// Cache-tag van alle pagina's van één host. Een route-handler achter een rewrite (de proxy stuurt elke host naar /s/<host>/…) krijgt van Next
// als pad-tag het OORSPRONKELIJKE pad ("/", "/over-ons"), en dat is voor elke site gelijk: revalidatePath kan er dus geen enkele site mee
// apart leegmaken. Daarom hangt de handler zelf een tag per host aan de pagina, en maakt publiceren precies die tag leeg.
// Tags mogen maximaal 256 tekens zijn; een host is er hooguit 253, dus een heel lange host wordt gehasht.
export const liveTag = (rawHost: string): string => {
  const host = normalizeHost(rawHost);
  return host.length > 200 ? `live:#${createHash("sha1").update(host).digest("hex")}` : `live:${host}`;
};

/**
 * Hangt de tag van deze host aan de pagina die nu wordt opgebouwd. Een kleine, tijdloze cache-uitkomst met die tag: verloopt de tag,
 * dan verloopt daarmee ook de gecachete pagina (en bouwt het volgende bezoek hem opnieuw op uit de database). De gegevens zelf komen
 * niet uit deze cache, dus er blijft niets verouderds hangen.
 */
export const tagLivePage = (rawHost: string): Promise<true> => unstable_cache(async () => true as const, ["live-page", normalizeHost(rawHost)], { tags: [liveTag(rawHost)] })();

/** De live site bij een hostnaam, of null als die host bij geen enkele gepubliceerde site hoort. Eén opzoeking per verzoek. */
export const findLiveSite = cache(async (rawHost: string): Promise<PublicSite | null> => {
  const host = normalizeHost(rawHost);

  const previewSlug = slugFromPreviewHost(host);
  let siteId: string | null = null;
  let kind: PublicSite["kind"] = "preview";
  if (previewSlug) {
    const [row] = await db.select({ id: sites.id }).from(sites).where(eq(sites.slug, previewSlug));
    siteId = row?.id ?? null;
  } else {
    const [row] = await db.select({ siteId: siteDomains.siteId }).from(siteDomains).where(eq(siteDomains.hostname, host));
    siteId = row?.siteId ?? null;
    kind = "domain";
  }
  if (!siteId) return null;

  const [site] = await db
    .select({ id: sites.id, slug: sites.slug, status: sites.status, publishedVersion: sites.publishedVersion })
    .from(sites)
    .where(eq(sites.id, siteId));
  if (!site || site.status !== "live" || site.publishedVersion === null) return null;

  const [row] = await db
    .select({ snapshot: siteVersions.snapshot })
    .from(siteVersions)
    .where(and(eq(siteVersions.siteId, site.id), eq(siteVersions.version, site.publishedVersion)));
  if (!row) return null;

  const [primary] = await db
    .select({ hostname: siteDomains.hostname })
    .from(siteDomains)
    .where(and(eq(siteDomains.siteId, site.id), eq(siteDomains.isPrimary, true), eq(siteDomains.status, "active")));

  return { id: site.id, slug: site.slug, version: site.publishedVersion, snapshot: row.snapshot, kind, host, primaryHost: primary?.hostname ?? null };
});

/** Het adres (met http of https) waarop een host bereikbaar is; lokaal zonder https. */
export function originOf(host: string): string {
  const local = host === "localhost" || host.startsWith("localhost:") || host.endsWith(".localhost") || /\.localhost:\d+$/.test(host);
  return `${local ? "http" : "https"}://${host}`;
}

/** Het pad van een pagina op de site (de homepagina is "/"). */
export const pagePath = (slug: string) => (slug === "" ? "/" : `/${slug}`);
