import { fallbackFaviconSvg, faviconUrl } from "@/lib/favicon";
import { findLiveSite, tagLivePage } from "@/lib/public-site";

type Params = Promise<{ host: string }>;

// Het favicon van een klantsite op `/favicon.ico`: de proxy herschrijft dat pad naar hier (src/proxy.ts), omdat browsers en crawlers het ongevraagd
// opvragen en ze anders het icoon van het platform kregen. Geüpload: door naar de PNG van 32 px. Anders: het automatische icoon (SVG).
// Gecachet en verlopen zoals de pagina's zelf (tag per host, zie tagLivePage); daarom geen `.ico` in de mapnaam: dat is een gereserveerde
// bestandsnaam in Next.
export const dynamicParams = true;
export const revalidate = 600;
export async function generateStaticParams() {
  return [];
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const site = await findLiveSite(decodeURIComponent((await params).host));
  if (!site) return new Response(null, { status: 404 });
  await tagLivePage(site.host);

  const { favicon, name, theme } = site.snapshot;
  if (favicon) return Response.redirect(faviconUrl(favicon, 32), 307);
  return new Response(fallbackFaviconSvg(name, theme), { headers: { "content-type": "image/svg+xml; charset=utf-8" } });
}
