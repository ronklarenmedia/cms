import { findLiveSite, originOf, pagePath } from "@/lib/public-site";

type Params = Promise<{ host: string }>;

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET(_request: Request, { params }: { params: Params }) {
  const site = await findLiveSite(decodeURIComponent((await params).host));
  // Alleen een eigen domein heeft een sitemap; een voorbeeldadres is niet voor zoekmachines.
  if (!site || site.kind === "preview") return new Response("Niet gevonden", { status: 404 });
  const origin = originOf(site.host);
  const urls = site.snapshot.pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${escapeXml(origin + pagePath(p.slug))}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
