import { asc, and, eq } from "drizzle-orm";
import type { SectionData } from "@/blocks/contract";
import { db } from "@/db";
import { hostedFonts, hostedIcons, pages, sites, siteVersions, type SiteSnapshot } from "@/db/schema";
import { nonCatalogueFamilies } from "@/lib/fonts";
import { effectiveSiteTheme } from "@/lib/kits";
import { hashSnapshot } from "@/lib/snapshot";
import { parseSections } from "./sections";

/** De iconnamen die usp-grid-items in deze secties gebruiken (vrije emoji zitten er ook tussen; alleen bekende namen matchen straks iets in `hosted_icons`). */
function uspGridIconNames(sections: readonly SectionData[]): string[] {
  const names = new Set<string>();
  for (const s of sections) {
    if (s.type !== "usp-grid") continue;
    const items = (s.content as { items?: { icon?: unknown }[] } | null)?.items ?? [];
    for (const item of items) if (typeof item.icon === "string" && item.icon) names.add(item.icon);
  }
  return [...names];
}

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

  // Kit en eigen afwijkingen samengevoegd: de momentopname is zelfstandig, ook als de kit later verandert of verdwijnt.
  const theme = await effectiveSiteTheme(site);

  // On-demand gehoste Google Fonts en Material Symbols worden hier opgelost en in de momentopname gebakken (net als
  // favicon hieronder), zodat het renderen van een openbare pagina nooit een extra databasequery nodig heeft. De
  // tabellen zijn platformbreed en klein: alles ophalen en in JS filteren is eenvoudiger en snel genoeg.
  const wantedFamilies = new Set(nonCatalogueFamilies(theme).map((f) => f.toLowerCase()));
  const usedHostedFonts = wantedFamilies.size > 0 ? (await db.select().from(hostedFonts)).filter((f) => wantedFamilies.has(f.family.toLowerCase())) : [];

  const wantedIcons = new Set([...outPages.flatMap((p) => uspGridIconNames(p.sections)), ...uspGridIconNames(header.sections), ...uspGridIconNames(footer.sections)]);
  const usedIcons =
    wantedIcons.size > 0
      ? Object.fromEntries((await db.select().from(hostedIcons)).filter((i) => wantedIcons.has(i.name)).map((i) => [i.name, i.svg]))
      : undefined;

  const snapshot: SiteSnapshot = {
    name: site.name,
    theme,
    layout: { header: header.sections, footer: footer.sections },
    pages: outPages,
    // Alleen als er een is geüpload/gebruikt: zo blijft de hash van sites zonder favicon/gehoste fonts/iconen gelijk aan die van hun bestaande momentopname.
    ...(site.faviconUrl ? { favicon: site.faviconUrl } : {}),
    ...(usedHostedFonts.length ? { hostedFonts: usedHostedFonts } : {}),
    ...(usedIcons ? { icons: usedIcons } : {}),
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
