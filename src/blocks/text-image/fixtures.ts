import type { TextImageFixture } from "./schema";

const image = { url: "/blocks/demo-photo.svg", alt: "Specialist aan het werk met laptop", width: 800, height: 600 };

export const fixtures: TextImageFixture[] = [
  {
    name: "Beeld rechts met kop, tekst en knoppen",
    variant: "image-right",
    content: {
      eyebrow: "Maatwerk oplossingen",
      heading: "Websites die passen als een gegoten jas",
      body: "Wij ontwerpen en ontwikkelen performante platforms die naadloos aansluiten op jouw bedrijfsprocessen.",
      buttons: [
        { label: "Neem contact op", href: "/contact", style: "primary" },
        { label: "Onze werkwijze", href: "/werkwijze", style: "secondary" },
      ],
      image,
    },
  },
  {
    name: "Beeld links met video verhouding",
    variant: "image-left",
    content: {
      eyebrow: "Innovatie",
      heading: "Klaar voor de toekomst van het web",
      body: "Met AI-geoptimaliseerde gestructureerde data en supersnelle laadtijden ben je je concurrentie altijd een stap voor.",
      image,
    },
    settings: { imageRatio: "video" },
  },
  {
    name: "Kaart op lichte achtergrond",
    variant: "cards",
    content: {
      heading: "Persoonlijke ondersteuning bij elke stap",
      body: "Van het eerste idee tot de livegang en het periodieke onderhoud: een vast aanspreekpunt staat voor je klaar.",
      buttons: [{ label: "Plan een kennismaking", href: "/afspraak", style: "primary" }],
      image,
    },
    settings: { background: "off-white" },
  },
  {
    name: "Minimaal (alleen kop en afbeelding)",
    variant: "image-right",
    content: {
      heading: "Samenwerken aan digitaal succes",
      image,
    },
  },
];
