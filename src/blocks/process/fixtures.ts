import type { ProcessFixture } from "./schema";

export const fixtures: ProcessFixture[] = [
  {
    name: "Horizontaal vierstappenplan",
    variant: "horizontal",
    content: {
      eyebrow: "Onze werkwijze",
      heading: "In 4 duidelijke stappen naar resultaat",
      intro: "Geen verrassingen achteraf. We hanteren een heldere structuur van intake tot lancering.",
      steps: [
        {
          number: "01",
          title: "Strategie & Intake",
          description: "We bespreken je doelen, doelgroep en gewenste uitstraling in een kennismakingsgesprek.",
          tag: "Week 1",
        },
        {
          number: "02",
          title: "Ontwerp & Structuur",
          description: "We selecteren de juiste componenten en gieten jouw huisstijl in een interactief voorbeeld.",
          tag: "Week 2",
        },
        {
          number: "03",
          title: "Inhoud & Koppelingen",
          description: "Plaatsen van teksten, professionele beelden en instellen van SEO-metadata en formulieren.",
          tag: "Week 3",
        },
        {
          number: "04",
          title: "Lancering & Training",
          description: "Je website gaat live op je eigen domeinnaam en we geven een korte instructie voor het beheer.",
          tag: "Week 4",
        },
      ],
      buttons: [
        {
          label: "Plan kennismaking",
          href: "/contact",
          style: "primary",
        },
      ],
    },
    settings: {
      maxWidth: "large",
    },
  },
  {
    name: "Genummerde kaarten",
    variant: "cards",
    content: {
      eyebrow: "Stappen",
      heading: "Hoe het werkt",
      steps: [
        {
          number: "1",
          title: "Kies je stijl",
          description: "Kies uit geteste block-varianten en stem kleuren, typografie en logo af.",
        },
        {
          number: "2",
          title: "Voeg content toe",
          description: "Vul je pagina's met overtuigende teksten, prijzen en klantervaringen.",
        },
        {
          number: "3",
          title: "Publiceer direct",
          description: "Met één klik staat je website veilig en razendsnel online.",
        },
      ],
    },
  },
  {
    name: "Verticale tijdlijn",
    variant: "timeline",
    content: {
      heading: "Projectfasen",
      intro: "Een transparant overzicht van het hele proces van start tot oplevering.",
      steps: [
        {
          number: "A",
          title: "Kick-off en analyse",
          description: "We brengen de huidige situatie in kaart en formuleren concrete mijlpalen.",
        },
        {
          number: "B",
          title: "Realisatie & feedbackrondes",
          description: "Bouw in korte sprints met tussentijdse demonstraties en snelle afstemming.",
        },
        {
          number: "C",
          title: "Oplevering & nazorg",
          description: "Livegang met monitoring, back-ups en doorlopende ondersteuning.",
        },
      ],
    },
  },
];
