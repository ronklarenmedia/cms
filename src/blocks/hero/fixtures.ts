import type { HeroFixture } from "./schema";

const media = { url: "/blocks/demo-photo.svg", alt: "Berglandschap in blauwe tinten", width: 800, height: 600 };

export const fixtures: HeroFixture[] = [
  {
    name: "Kop, tekst, twee knoppen en beeld",
    variant: "split",
    content: {
      eyebrow: "Strategie & realisatie",
      heading: "Merkwerk dat blijft staan",
      body: "Eén component, elke klant een eigen kit. Tekst en beeld komen uit de CMS-velden van de site.",
      buttons: [
        { label: "Plan een gesprek", href: "/contact", style: "primary" },
        { label: "Bekijk werk", href: "/projecten", style: "secondary" },
      ],
      media,
    },
  },
  {
    name: "Beeld links, zonder knoppen",
    variant: "split-reverse",
    content: {
      heading: "Websites die snel laden en goed gevonden worden",
      body: "Gebouwd voor snelheid en voor zoekmachines én AI-assistenten.",
      media,
    },
  },
  {
    name: "Gecentreerd, minimaal (alleen verplichte velden)",
    variant: "centered",
    content: { heading: "Welkom bij Ron Klaren Media" },
    settings: { height: "compact" },
  },
  {
    name: "Gecentreerd op donkere achtergrond",
    variant: "centered",
    content: {
      eyebrow: "Nieuw",
      heading: "Van idee naar live in één middag",
      body: "Kies een kit, vul je teksten in en publiceer.",
      buttons: [{ label: "Start nu", href: "/start", style: "primary" }],
    },
    settings: { background: "primary-dark", height: "normal" },
  },
];
