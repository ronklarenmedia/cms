import type { LogoBarFixture } from "./schema";

const logoMedia = (name: string) => ({
  url: "/blocks/demo-photo.svg",
  alt: `Logo van ${name}`,
  width: 160,
  height: 60,
});

export const fixtures: LogoBarFixture[] = [
  {
    name: "Raster met kop en links",
    variant: "grid",
    content: {
      eyebrow: "Partners",
      heading: "Vertrouwd door toonaangevende organisaties",
      logos: [
        { name: "Acme Corp", image: logoMedia("Acme Corp"), href: "/partners/acme" },
        { name: "GlobalTech", image: logoMedia("GlobalTech"), href: "/partners/globaltech" },
        { name: "Innovate Labs", image: logoMedia("Innovate Labs") },
        { name: "Nexus Media", image: logoMedia("Nexus Media") },
      ],
    },
  },
  {
    name: "Horizontale rij op lichte achtergrond",
    variant: "row",
    content: {
      heading: "Gecertificeerd partner van",
      logos: [
        { name: "Google Cloud", image: logoMedia("Google Cloud") },
        { name: "Vercel", image: logoMedia("Vercel") },
        { name: "Stripe", image: logoMedia("Stripe") },
      ],
    },
    settings: { background: "off-white" },
  },
  {
    name: "Grijswaarden (gedimd)",
    variant: "grayscale",
    content: {
      logos: [
        { name: "Partner A", image: logoMedia("Partner A") },
        { name: "Partner B", image: logoMedia("Partner B") },
        { name: "Partner C", image: logoMedia("Partner C") },
        { name: "Partner D", image: logoMedia("Partner D") },
      ],
    },
  },
  {
    name: "Minimaal (alleen 2 logo's zonder kop)",
    variant: "grid",
    content: {
      logos: [
        { name: "Klant 1", image: logoMedia("Klant 1") },
        { name: "Klant 2", image: logoMedia("Klant 2") },
      ],
    },
  },
];
