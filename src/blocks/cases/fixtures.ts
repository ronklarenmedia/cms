import type { CasesFixture } from "./schema";

const image = { url: "/blocks/demo-photo.svg", alt: "Voorbeeld van het opgeleverde werk", width: 800, height: 600 };

export const fixtures: CasesFixture[] = [
  {
    name: "Raster met drie cases",
    variant: "grid",
    content: {
      eyebrow: "Ons werk",
      heading: "Projecten waar we trots op zijn",
      intro: "Een greep uit wat we de afgelopen jaren voor klanten hebben gebouwd.",
      items: [
        {
          title: "Nieuwe website voor Robuust",
          client: "Robuust Hovenierswerk",
          summary: "Een snelle website met projectfoto's en offerteaanvraag, waarmee het aantal aanvragen verdubbelde.",
          image,
          tags: ["Website", "Fotografie"],
          href: "/projecten/robuust",
        },
        {
          title: "Webshop voor Van der Berg",
          client: "Van der Berg Fietsen",
          summary: "Een overzichtelijke webshop met winkelvoorraad per vestiging.",
          image,
          tags: ["Webshop"],
          href: "/projecten/van-der-berg",
          cta: "Lees het verhaal",
        },
        {
          title: "Huisstijl en site voor Dijkstra",
          client: "Dijkstra Advies",
          summary: "Van logo tot website: één herkenbaar geheel voor een adviesbureau.",
          image,
          tags: ["Huisstijl", "Website"],
        },
      ],
    },
  },
  {
    name: "Uitgelicht, twee cases in twee kolommen",
    variant: "featured",
    content: {
      heading: "Uitgelicht werk",
      items: [
        {
          title: "Hoe Robuust online groeide",
          client: "Robuust Hovenierswerk",
          summary: "Meer vindbaarheid in de regio, en een site die binnen een seconde laadt.",
          image,
          tags: ["SEO", "Website"],
          href: "/projecten/robuust",
        },
        { title: "Webshop Van der Berg", image, tags: ["Webshop"] },
        { title: "Website Dijkstra", image },
      ],
    },
    settings: { columns: "2", aspect: "video" },
  },
  {
    name: "Minimaal, één case zonder link (alleen verplichte velden)",
    variant: "grid",
    content: {
      items: [{ title: "Een nieuw project", image }],
    },
  },
];
