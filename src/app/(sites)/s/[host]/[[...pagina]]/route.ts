import { permanentRedirect } from "next/navigation";
import { findLiveSite, originOf, pagePath, tagLivePage } from "@/lib/public-site";
import { renderSiteNotFound, renderSitePage } from "@/lib/site-html";

type Params = Promise<{ host: string; pagina?: string[] }>;

// De openbare pagina's van alle sites, als pure HTML zonder JavaScript (zie src/lib/site-html.tsx). Een route-handler in plaats van een pagina:
// een Next-pagina levert altijd de React-runtime mee (~170 KB gzip), ook als niets ervan gebruikt wordt.
//
// Elke pagina wordt bij het eerste bezoek opgebouwd en daarna gecachet (ISR); publiceren maakt de cache van de site ongeldig
// (revalidatePublicSite in src/lib/site-domains.ts, via de tag per host: zie tagLivePage). Er wordt bewust geen sessie of cookie gelezen: dat zou de pagina dynamisch maken.
export const dynamicParams = true;
// Vangnet: mocht het legen van de cache ooit niet aankomen, dan is een pagina hooguit 10 minuten oud.
export const revalidate = 600;
export async function generateStaticParams() {
  return [];
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { host: rawHost, pagina } = await params;
  if (pagina && pagina.length > 1) return renderSiteNotFound(); // paginaslugs bevatten geen slashes

  const site = await findLiveSite(decodeURIComponent(rawHost));
  const page = site?.snapshot.pages.find((p) => p.slug === (pagina?.[0] ?? ""));
  if (!site || !page) return renderSiteNotFound();
  await tagLivePage(site.host);

  // Eén adres per site: wie via een ander adres binnenkomt (www of kaal, het voorbeeldadres), gaat permanent naar het primaire domein.
  if (site.primaryHost && site.host !== site.primaryHost) permanentRedirect(`${originOf(site.primaryHost)}${pagePath(page.slug)}`);

  return renderSitePage(site, page);
}
