import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // De componentpagina's lezen de styles.css van elk block om de gebruikte tokens te tonen;
  // die bestanden worden nergens geïmporteerd, dus moeten expliciet in de server-trace.
  outputFileTracingIncludes: {
    "/componenten": ["./src/blocks/*/styles.css"],
    "/componenten/editor": ["./src/blocks/*/styles.css"],
  },
};

export default nextConfig;
