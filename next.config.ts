import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Afbeeldingen worden via een server action geüpload (max. 5 MB, zie src/lib/media.ts); de standaardlimiet is 1 MB.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // De componentpagina's lezen de styles.css van elk block om de gebruikte tokens te tonen;
  // die bestanden worden nergens geïmporteerd, dus moeten expliciet in de server-trace.
  // Lettertypes voor klantsites (public/fonts/v1): de map heeft een versienummer, dus de bestanden veranderen nooit en mogen een jaar gecachet.
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/fonts/:path*", headers: immutable },
      // Optionele scripts voor openbare pagina's (src/lib/enhancements.ts); ook versiemap, dus onveranderlijk.
      { source: "/enhance/:path*", headers: immutable },
    ];
  },
  outputFileTracingIncludes: {
    // De openbare pagina's lezen de CSS van alle blocks bij het opbouwen (src/lib/site-css.ts); die bestanden worden nergens geïmporteerd.
    "/s/**": ["./src/blocks/blocks.css", "./src/blocks/*/styles.css", "./src/app/(sites)/sites.css", "./src/app/(beheer)/websites/site-frame.css"],
    "/componenten": ["./src/blocks/*/styles.css"],
    "/componenten/editor": ["./src/blocks/*/styles.css"],
  },
};

export default nextConfig;
