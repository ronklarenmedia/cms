import type { TestimonialsFixture } from "./schema";

const avatar = { url: "/blocks/demo-photo.svg", alt: "Pasfoto van de auteur", width: 100, height: 100 };

const items = [
  {
    quote: "Sinds de lancering van onze nieuwe site via Ron Klaren Media is onze conversie met 35% gestegen. Ontzettend fijne samenwerking!",
    name: "Sanne de Jong",
    role: "Marketing Director bij TechFlow",
    avatar,
    rating: 5,
  },
  {
    quote: "De laadsnelheid is bizar goed en het beheer in het dashboard is super intuïtief. Een verademing vergeleken met ons oude platform.",
    name: "Mark van Leeuwen",
    role: "Eigenaar Van Leeuwen Logistiek",
    avatar,
    rating: 5,
  },
  {
    quote: "Strak design dat perfect aansluit bij onze merkidentiteit. Duidelijke afspraken en snelle oplevering.",
    name: "Lisa Bakker",
    role: "Oprichtster Studio Bakker",
    rating: 4,
  },
];

export const fixtures: TestimonialsFixture[] = [
  {
    name: "Grid met 3 testimonials en sterren",
    variant: "grid",
    content: {
      eyebrow: "Ervaringen",
      heading: "Wat onze klanten zeggen",
      intro: "Lees hoe wij organisaties hebben geholpen met hun digitale transformatie.",
      items,
    },
    settings: { columns: "3" },
  },
  {
    name: "Eén grote quote (single)",
    variant: "single",
    content: {
      items: [items[0]],
    },
    settings: { background: "primary-light" },
  },
  {
    name: "Kaarten in 2 kolommen op donkere achtergrond",
    variant: "cards",
    content: {
      heading: "Klantverhalen",
      items: items.slice(0, 2),
    },
    settings: { columns: "2", background: "primary-dark" },
  },
  {
    name: "Minimaal (1 quote zonder avatar of rating)",
    variant: "grid",
    content: {
      items: [{ quote: "Uitstekende service en hoge kwaliteit.", name: "Jan de Vries" }],
    },
    settings: { columns: "1" },
  },
];
