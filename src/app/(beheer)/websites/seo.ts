import type { Metadata } from "next";

export type SeoPage = {
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  noindex: boolean;
};

/** De titel in het tabblad en in zoekresultaten. Zelf ingevuld = zoals ingevuld; anders "Pagina | Site" (homepagina: alleen de sitenaam). */
export function documentTitle(siteName: string, page: Pick<SeoPage, "slug" | "title" | "seoTitle">): string {
  const own = page.seoTitle?.trim();
  if (own) return own;
  return page.slug === "" ? siteName : `${page.title} | ${siteName}`;
}

/** Aanbevolen lengtes; daarboven knipt Google af. Alleen een richtlijn, geen harde grens. */
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 160;

/** Next-metadata voor een pagina. Een voorbeeld staat nooit in zoekmachines, ook niet als de pagina zelf wel geïndexeerd mag worden. */
export function pageMetadata(siteName: string, page: SeoPage, { preview }: { preview: boolean }): Metadata {
  const title = documentTitle(siteName, page);
  const description = page.seoDescription?.trim() || undefined;
  const hidden = preview || page.noindex;
  return {
    title,
    description,
    robots: hidden ? { index: false, follow: false } : undefined,
    openGraph: { type: "website", title, description, siteName, images: page.ogImage ? [page.ogImage] : undefined },
  };
}
