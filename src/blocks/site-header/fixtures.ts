import type { SiteHeaderFixture } from "./schema";

const links = [
  { label: "Diensten", href: "/diensten", children: [
    { label: "Websites", href: "/diensten/websites" },
    { label: "Webshops", href: "/diensten/webshops" },
    { label: "Onderhoud", href: "/diensten/onderhoud" },
  ] },
  { label: "Projecten", href: "/projecten", children: [] },
  { label: "Over ons", href: "/over-ons", children: [] },
  { label: "Contact", href: "/contact", children: [] },
];

export const fixtures: SiteHeaderFixture[] = [
  {
    name: "Logo links met uitklapmenu en knop",
    variant: "inline",
    content: {
      brand: "Meridian Studio",
      logo: { url: "/blocks/demo-photo.svg", alt: "Logo van Meridian Studio", width: 40, height: 40 },
      links,
      button: { label: "Plan een gesprek", href: "/contact", style: "primary" },
    },
  },
  {
    name: "Gecentreerd met menu",
    variant: "centered",
    content: {
      brand: "Meridian Studio",
      links: links.filter((l) => l.children.length === 0),
    },
  },
  {
    name: "Minimaal (alleen de naam)",
    variant: "inline",
    content: { brand: "Meridian Studio" },
  },
];
