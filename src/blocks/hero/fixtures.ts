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
  {
    name: "Collage met statistiek en vinkjeslijst",
    variant: "split",
    content: {
      eyebrow: "Sample subtitle",
      heading: "Technische prestaties zorgen voor betrouwbaarheid",
      body: "Gebouwd voor snelheid, zonder in te leveren op vormgeving of vindbaarheid.",
      buttons: [{ label: "Aan de slag", href: "/contact", style: "secondary" }],
      media,
      accentMedia: { url: "/blocks/demo-photo.svg", alt: "Detailfoto van het team aan het werk", width: 800, height: 600 },
      stat: { value: "15+", label: "jaar ervaring" },
      highlights: [{ label: "Snel geladen" }, { label: "Cross-browser" }, { label: "Zelf te beheren" }, { label: "Retina-scherm" }],
    },
  },
  {
    name: "Collage met twee knoppen en uitgelichte punten",
    variant: "split",
    content: {
      eyebrow: "Sample subtitle",
      heading: "Responsief ontwerp op elk apparaat",
      body: "Elke pagina past zich vanzelf aan, van telefoon tot groot scherm.",
      buttons: [
        { label: "Aan de slag", href: "/contact", style: "primary" },
        { label: "Meer weten", href: "/diensten", style: "secondary" },
      ],
      media,
      accentMedia: { url: "/blocks/demo-photo.svg", alt: "Weergave op een tablet", width: 800, height: 600 },
      highlights: [
        { label: "Vaste partner", description: "Eén aanspreekpunt van ontwerp tot beheer." },
        { label: "Exclusieve deals", description: "Vaste prijsafspraken zonder verrassingen achteraf." },
      ],
    },
  },
  {
    name: "Collage met vinkjeslijst en oprichter",
    variant: "split-reverse",
    content: {
      eyebrow: "Sample subtitle",
      heading: "Persoonlijk contact, geen callcenter",
      body: "Je werkt rechtstreeks met wie het bouwt en onderhoudt.",
      media,
      accentMedia: { url: "/blocks/demo-photo.svg", alt: "Kantoor met daglicht", width: 800, height: 600 },
      highlights: [{ label: "Snel geladen" }, { label: "Eenvoudig te beheren" }, { label: "Retina-scherm" }],
      signee: { name: "Ron Klaren", role: "Oprichter" },
    },
  },
];
