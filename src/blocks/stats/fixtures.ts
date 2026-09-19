import type { StatsFixture } from "./schema";

const items = [
  { value: "500+", label: "Tevreden klanten", description: "Middelgrote en grote organisaties in de Benelux." },
  { value: "99.9%", label: "Uptime garantie", description: "Bewaakt door onze 24/7 infrastructuur monitoring." },
  { value: "< 100ms", label: "Laadtijd", description: "Geoptimaliseerd voor Core Web Vitals en conversie." },
  { value: "15+", label: "Jaar ervaring", description: "Specialisten in maatwerk software en websites." },
];

export const fixtures: StatsFixture[] = [
  {
    name: "Eenvoudig, 4 kolommen met kop",
    variant: "plain",
    content: {
      eyebrow: "Resultaten",
      heading: "Cijfers die voor zich spreken",
      intro: "Onze impact in feiten en cijfers over de afgelopen jaren.",
      items,
    },
    settings: { columns: "4" },
  },
  {
    name: "Kaarten, 3 kolommen",
    variant: "cards",
    content: {
      heading: "Onze prestaties",
      items: items.slice(0, 3),
    },
    settings: { columns: "3", background: "off-white" },
  },
  {
    name: "Met scheidingslijnen, op donkere achtergrond",
    variant: "bordered",
    content: {
      items: items.map(({ value, label }) => ({ value, label })),
    },
    settings: { columns: "4", background: "primary-dark" },
  },
  {
    name: "Minimaal (alleen 2 items)",
    variant: "plain",
    content: {
      items: [
        { value: "100k+", label: "Gebruikers" },
        { value: "24/7", label: "Support" },
      ],
    },
    settings: { columns: "2" },
  },
];
