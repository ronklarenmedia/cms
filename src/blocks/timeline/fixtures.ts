import type { TimelineFixture } from "./schema";

export const fixtures: TimelineFixture[] = [
  {
    name: "Horizontaal, bedrijfsgeschiedenis",
    variant: "horizontal",
    content: {
      eyebrow: "Ons verhaal",
      heading: "Vijftien jaar in vogelvlucht",
      intro: "Van een studentenproject tot een team dat merken en websites bouwt voor het hele land.",
      items: [
        { date: "2010", title: "Het begin", text: "Ron bouwt de eerste websites vanuit een zolderkamer in Zwolle." },
        { date: "2015", title: "Eerste medewerker", text: "Er komt versterking voor ontwerp en tekst; de klantenkring groeit door mond-tot-mondreclame." },
        { date: "2020", title: "Eigen platform", text: "We bouwen een eigen websitebouwer, zodat elke klant snel en betaalbaar online staat." },
        { date: "2025", title: "Nieuwe generatie", text: "Nieuwe blocks, betere vindbaarheid en een assistent die meeschrijft aan de inhoud." },
      ],
    },
  },
  {
    name: "Verticaal, projectplanning",
    variant: "vertical",
    content: {
      heading: "Planning van je project",
      items: [
        { date: "Week 1", title: "Kennismaking", text: "We bespreken je doelen, doelgroep en wensen." },
        { date: "Week 2", title: "Ontwerp", text: "Je ziet een eerste voorbeeld in je eigen huisstijl." },
        { date: "Week 3", title: "Inhoud", text: "Teksten, beelden en zoekmachine-instellingen worden geplaatst." },
        { date: "Week 4", title: "Live", text: "Je website gaat online op je eigen domein." },
      ],
    },
  },
  {
    name: "Minimaal, zonder kop (alleen verplichte velden)",
    variant: "horizontal",
    content: {
      items: [
        { date: "2023", title: "Start" },
        { date: "2024", title: "Groei" },
      ],
    },
  },
];
