import { getR2Config } from "@/lib/r2";

// Zelf-gehoste Google Fonts, zelfde origin als de site die ze gebruikt (geen CORS nodig voor @font-face). Het pad
// bevat een punt (…woff2), dus src/proxy.ts's matcher slaat dit route over: identiek gedrag op elk aangepast domein,
// zonder per-host routing, precies zoals de statische lettertypes in public/fonts/v1. De cache-header komt al van de
// bestaande regel voor "/fonts/:path*" in next.config.ts.
//
// Bestanden staan in R2 onder fonts/g/<font-id>/<gewicht>.woff2 (zie src/lib/google-fonts.ts); dit route haalt ze
// server-naar-server op en geeft ze door, zodat de bezoeker nooit rechtstreeks met R2 praat.

const FILE_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9.-]+\.woff2$/i;

type Params = Promise<{ file: string[] }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const file = (await params).file.join("/");
  if (!FILE_RE.test(file)) return new Response(null, { status: 400 });

  const config = getR2Config();
  if (!config?.publicUrl) return new Response(null, { status: 404 });

  const upstream = await fetch(`${config.publicUrl}/fonts/g/${file}`, { cache: "force-cache" });
  if (!upstream.ok || !upstream.body) return new Response(null, { status: 404 });

  return new Response(upstream.body, { headers: { "content-type": "font/woff2" } });
}
