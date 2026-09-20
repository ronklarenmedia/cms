import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Afbeeldingen worden via een server action geüpload (max. 5 MB, zie src/lib/media.ts); de standaardlimiet is 1 MB.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // De componentpagina's lezen de styles.css van elk block om de gebruikte tokens te tonen;
  // die bestanden worden nergens geïmporteerd, dus moeten expliciet in de server-trace.
  outputFileTracingIncludes: {
    "/componenten": ["./src/blocks/*/styles.css"],
    "/componenten/editor": ["./src/blocks/*/styles.css"],
  },
};

export default nextConfig;
