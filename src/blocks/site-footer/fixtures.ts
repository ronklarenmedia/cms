import type { SiteFooterFixture } from "./schema";

export const fixtures: SiteFooterFixture[] = [
  {
    name: "Kolommen met contact en juridische links",
    variant: "columns",
    content: {
      brand: "Meridian Studio",
      description: "Merk, website en campagne uit één hand. Ontworpen in Utrecht, gebouwd voor snelheid.",
      columns: [
        {
          title: "Diensten",
          links: [
            { label: "Websites", href: "/diensten/websites" },
            { label: "Webshops", href: "/diensten/webshops" },
            { label: "Onderhoud", href: "/diensten/onderhoud" },
          ],
        },
        {
          title: "Bedrijf",
          links: [
            { label: "Over ons", href: "/over-ons" },
            { label: "Projecten", href: "/projecten" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      contact: { email: "hallo@meridian.nl", phone: "030 123 45 67", address: "Oudegracht 12, 3511 AB Utrecht" },
      legalLinks: [
        { label: "Privacybeleid", href: "/privacy" },
        { label: "Algemene voorwaarden", href: "/voorwaarden" },
      ],
      copyright: "© 2026 Meridian Studio",
    },
  },
  {
    name: "Eén regel",
    variant: "simple",
    content: {
      brand: "Meridian Studio",
      columns: [
        {
          title: "Menu",
          links: [
            { label: "Diensten", href: "/diensten" },
            { label: "Over ons", href: "/over-ons" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ],
      legalLinks: [{ label: "Privacybeleid", href: "/privacy" }],
      copyright: "© 2026 Meridian Studio",
    },
  },
  {
    name: "Minimaal (alleen de naam)",
    variant: "columns",
    content: { brand: "Meridian Studio" },
  },
];
