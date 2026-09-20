import { and, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { sites, siteVersions, type SiteSnapshot } from "@/db/schema";
import { normalizeHost, slugFromPreviewHost } from "./site-hosts";

// Wat een bezoeker van een gepubliceerde site te zien krijgt: altijd de live versie uit `site_versions`, nooit de werkkopie.

export type PublicSite = {
  id: string;
  slug: string;
  version: number;
  snapshot: SiteSnapshot;
  /** Voorbeeldadres (nooit in zoekmachines) of een eigen domein van de klant. */
  kind: "preview" | "domain";
  host: string;
};

/** De live site bij een hostnaam, of null als die host bij geen enkele gepubliceerde site hoort. Eén opzoeking per verzoek. */
export const findLiveSite = cache(async (rawHost: string): Promise<PublicSite | null> => {
  const host = normalizeHost(rawHost);
  const slug = slugFromPreviewHost(host);
  if (!slug) return null; // eigen domeinen van klanten volgen; nu bestaan alleen voorbeeldadressen

  const [site] = await db
    .select({ id: sites.id, slug: sites.slug, status: sites.status, publishedVersion: sites.publishedVersion })
    .from(sites)
    .where(eq(sites.slug, slug));
  if (!site || site.status !== "live" || site.publishedVersion === null) return null;

  const [row] = await db
    .select({ snapshot: siteVersions.snapshot })
    .from(siteVersions)
    .where(and(eq(siteVersions.siteId, site.id), eq(siteVersions.version, site.publishedVersion)));
  if (!row) return null;
  return { id: site.id, slug: site.slug, version: site.publishedVersion, snapshot: row.snapshot, kind: "preview", host };
});

/** Het adres (met http of https) waarop een host bereikbaar is; lokaal zonder https. */
export function originOf(host: string): string {
  const local = host === "localhost" || host.startsWith("localhost:") || host.endsWith(".localhost") || /\.localhost:\d+$/.test(host);
  return `${local ? "http" : "https"}://${host}`;
}
