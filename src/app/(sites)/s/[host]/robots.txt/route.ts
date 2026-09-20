import { findLiveSite, originOf } from "@/lib/public-site";

type Params = Promise<{ host: string }>;

const text = (body: string) =>
  new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" } });

export async function GET(_request: Request, { params }: { params: Params }) {
  const site = await findLiveSite(decodeURIComponent((await params).host));
  if (!site) return new Response("Niet gevonden", { status: 404 });
  // Een voorbeeldadres hoort nooit in zoekmachines; een eigen domein wel, met de sitemap erbij.
  if (site.kind === "preview") return text("User-agent: *\nDisallow: /\n");
  return text(`User-agent: *\nAllow: /\n\nSitemap: ${originOf(site.host)}/sitemap.xml\n`);
}
