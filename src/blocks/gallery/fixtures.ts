import type { GalleryFixture } from "./schema";

const photo = (alt: string) => ({ url: "/blocks/demo-photo.svg", alt, width: 800, height: 600 });
const tall = (alt: string) => ({ url: "/blocks/demo-photo.svg", alt, width: 600, height: 900 });

export const fixtures: GalleryFixture[] = [
  {
    name: "Raster, zes beelden met bijschrift",
    variant: "grid",
    content: {
      eyebrow: "Sfeerimpressie",
      heading: "Een kijkje in onze werkplaats",
      intro: "Het werk van de afgelopen maanden, van eerste schets tot oplevering.",
      images: [
        { image: photo("Werkbank met schetsen en gereedschap"), caption: "De werkbank" },
        { image: photo("Klant en ontwerper bekijken samen een ontwerp"), caption: "Samen ontwerpen" },
        { image: photo("Een afgewerkte tuin bij zonsondergang"), caption: "Oplevering" },
        { image: photo("Materialen op een rij"), caption: "Materialen" },
        { image: photo("Detail van een gemetselde muur"), caption: "Detailwerk" },
        { image: photo("Het team op locatie"), caption: "Het team" },
      ],
    },
  },
  {
    name: "Bento, vijf beelden",
    variant: "bento",
    content: {
      heading: "Uitgelicht",
      images: [
        { image: photo("Grote foto van het eindresultaat"), caption: "Het eindresultaat" },
        { image: tall("Staand portret van het team") },
        { image: photo("Detail van het ontwerp") },
        { image: photo("Sfeerbeeld van de locatie") },
        { image: photo("Een gebruikte werkplek") },
      ],
    },
    settings: { columns: "4" },
  },
  {
    name: "Metselwerk, beelden op eigen hoogte",
    variant: "masonry",
    content: {
      images: [
        { image: photo("Landschapsfoto van het werk"), caption: "Overzicht" },
        { image: tall("Staande foto van een detail") },
        { image: photo("Sfeerbeeld") },
        { image: tall("Portret van een medewerker"), caption: "Aan het werk" },
        { image: photo("Een tweede landschapsfoto") },
      ],
    },
    settings: { columns: "3" },
  },
  {
    name: "Minimaal, twee vierkante beelden (alleen verplichte velden)",
    variant: "grid",
    content: {
      images: [{ image: photo("Eerste beeld") }, { image: photo("Tweede beeld") }],
    },
    settings: { columns: "2", aspect: "square" },
  },
];
