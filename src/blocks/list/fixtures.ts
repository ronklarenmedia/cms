import type { ListFixture } from "./schema";

export const fixtures: ListFixture[] = [
  {
    name: "Uitgebreid, diensten met links",
    variant: "detailed",
    content: {
      eyebrow: "Wat we doen",
      heading: "Onze diensten",
      intro: "Van eerste idee tot een website die blijft presteren.",
      items: [
        { tag: "01", title: "Websites", text: "Snelle, goed vindbare websites in je eigen huisstijl.", href: "/diensten/websites" },
        { tag: "02", title: "Webshops", text: "Een overzichtelijke winkel met betaling en voorraadbeheer.", href: "/diensten/webshops" },
        { tag: "03", title: "Onderhoud", text: "Updates, back-ups en monitoring, zodat jij je kunt richten op je klanten.", href: "/diensten/onderhoud" },
      ],
    },
  },
  {
    name: "Simpel, projecten met tags",
    variant: "simple",
    content: {
      heading: "Recente projecten",
      items: [
        { title: "Robuust Hovenierswerk", tags: ["Website", "SEO"], href: "/projecten/robuust" },
        { title: "Van der Berg Fietsen", tags: ["Webshop"] },
        { title: "Dijkstra Advies", tags: ["Huisstijl", "Website", "Fotografie"], href: "/projecten/dijkstra" },
      ],
    },
  },
  {
    name: "Minimaal, één rij (alleen verplichte velden)",
    variant: "detailed",
    content: {
      items: [{ title: "Een enkel onderdeel" }],
    },
  },
];
