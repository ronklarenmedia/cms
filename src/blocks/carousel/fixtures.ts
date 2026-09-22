import type { CarouselFixture } from "./schema";

const img = (alt: string) => ({ url: "/blocks/demo-photo.svg", alt, width: 1200, height: 800 });

export const fixtures: CarouselFixture[] = [
  {
    name: "Vier dia's, één per keer",
    variant: "full",
    content: {
      eyebrow: "Projecten",
      heading: "Een greep uit ons werk",
      intro: "Schuif langs onze recente projecten.",
      slides: [
        { image: img("Website voor een makelaarskantoor"), heading: "Makelaardij De Vries", text: "Volledig nieuwe huisstijl en website." },
        { image: img("Webshop voor een interieurzaak"), heading: "Interieur Bloom", text: "Webshop met 400+ producten." },
        { image: img("Website voor een advocatenkantoor"), heading: "Advocatenkantoor Sterk", text: "Vertrouwenwekkend en snel." },
        { image: img("App-landingspagina"), heading: "TrackFit app", text: "Landingspagina voor een nieuwe app." },
      ],
    },
  },
  {
    name: "Piepende volgende dia (minimaal)",
    variant: "peek",
    content: {
      slides: [{ image: img("Kantoorfoto") }, { image: img("Teamfoto") }, { image: img("Werkplek detail") }],
    },
  },
];
