import type { SectionHeadingFixture } from "./schema";

export const fixtures: SectionHeadingFixture[] = [
  {
    name: "Gecentreerd met eyebrow, intro en knop",
    variant: "centered",
    content: {
      eyebrow: "Over ons bedrijf",
      heading: "Wij bouwen digitale ervaringen die impact maken",
      intro: "Met ons gedreven team van specialisten helpen we organisaties groeien door middel van slimme webtechnologie.",
      buttons: [{ label: "Bekijk onze cases", href: "/cases", style: "primary" }],
    },
  },
  {
    name: "Links uitgelijnd met eyebrow en intro",
    variant: "left",
    content: {
      eyebrow: "Onze expertise",
      heading: "Oplossingen op maat voor jouw organisatie",
      intro: "Van strategisch advies tot vlekkeloze realisatie. Ontdek hoe wij het verschil maken.",
    },
  },
  {
    name: "Gesplitst, kop links en intro rechts",
    variant: "split",
    content: {
      eyebrow: "Werkwijze",
      heading: "Transparant, doelgericht en resultaatgedreven",
      intro: "We geloven in korte lijnen en duidelijke afspraken. Zo behalen we samen het beste resultaat zonder verrassingen achteraf.",
      buttons: [{ label: "Lees meer over onze aanpak", href: "/over-ons", style: "secondary" }],
    },
  },
  {
    name: "Minimaal (alleen kop)",
    variant: "centered",
    content: {
      heading: "Veelgestelde vragen",
    },
  },
];
