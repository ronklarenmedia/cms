import type { BreadcrumbsFixture } from "./schema";

export const fixtures: BreadcrumbsFixture[] = [
  {
    name: "Pijltjes, drie niveaus",
    variant: "chevron",
    content: {
      items: [
        { label: "Home", href: "/" },
        { label: "Diensten", href: "/diensten" },
        { label: "Websites laten maken" },
      ],
    },
  },
  {
    name: "Schuine streep, vier niveaus",
    variant: "slash",
    content: {
      items: [
        { label: "Home", href: "/" },
        { label: "Kennisbank", href: "/kennisbank" },
        { label: "Zoekmachine-optimalisatie", href: "/kennisbank/seo" },
        { label: "Zo schrijf je een goede paginatitel" },
      ],
    },
  },
  {
    name: "Minimaal, twee niveaus (alleen verplichte velden)",
    variant: "chevron",
    content: {
      items: [{ label: "Home", href: "/" }, { label: "Contact" }],
    },
  },
];
