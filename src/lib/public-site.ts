import { and, eq } from "drizzle-orm";
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
