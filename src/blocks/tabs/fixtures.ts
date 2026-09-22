import type { TabsFixture } from "./schema";

export const fixtures: TabsFixture[] = [
  {
    name: "Drie tabbladen, onderstreept",
    variant: "underline",
    content: {
      eyebrow: "Diensten",
      heading: "Wat we voor je kunnen doen",
      intro: "Kies een tabblad voor meer details.",
      items: [
        {
          label: "Websites",
          heading: "Websites op maat",
          body: "Van eenvoudige brochurewebsite tot uitgebreid platform, opgebouwd uit herbruikbare blocks en een eigen design-kit.",
        },
        {
          label: "Onderhoud",
          heading: "Onderhoud en beheer",
          body: "We houden je site up-to-date, snel en veilig, zodat jij je met je bedrijf bezig kunt houden.",
        },
        {
          label: "Advies",
          heading: "Strategisch advies",
          body: "Van vindbaarheid tot conversie: we denken mee over wat je website daadwerkelijk oplevert.",
        },
      ],
    },
  },
  {
    name: "Twee tabbladen, pillen (minimaal)",
    variant: "pills",
    content: {
      items: [
        { label: "Particulier", body: "Voor freelancers en kleine ondernemers die snel online willen." },
        { label: "Zakelijk", body: "Voor organisaties met meerdere merken, talen of afdelingen." },
      ],
    },
  },
];
