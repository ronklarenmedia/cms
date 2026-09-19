import type { FaqFixture } from "./schema";

export const fixtures: FaqFixture[] = [
  {
    name: "Standaard accordeon",
    variant: "accordion",
    content: {
      eyebrow: "Antwoorden",
      heading: "Veelgestelde vragen",
      intro: "Vind snel antwoord op de meest gestelde vragen over onze werkwijze, tarieven en ondersteuning.",
      items: [
        {
          question: "Hoe snel kan een nieuwe website live staan?",
          answer: "Meestal lanceren we binnen twee tot vier weken na het definitieve akkoord op het ontwerp en de aangeleverde inhoud.",
        },
        {
          question: "Kan ik zelf eenvoudig teksten en afbeeldingen aanpassen?",
          answer: "Ja, dankzij ons modulaire CMS pas je teksten, afbeeldingen en navigatie direct aan zonder technische kennis.",
        },
        {
          question: "Wordt er rekening gehouden met zoekmachineoptimalisatie (SEO)?",
          answer: "Elke pagina bevat automatische meta-tags, semantische HTML, snelle laadtijden en gestructureerde data voor Google.",
        },
        {
          question: "Wat als ik later extra functionaliteiten wil toevoegen?",
          answer: "Ons platform is modulair opgebouwd; nieuwe pagina's, formulieren of koppelingen voeg je op ieder moment toe.",
        },
      ],
      button: {
        label: "Stel een andere vraag",
        href: "/contact",
        style: "secondary",
      },
    },
    settings: {
      maxWidth: "standard",
    },
  },
  {
    name: "Twee kolommen overzicht",
    variant: "two-column",
    content: {
      eyebrow: "Kennisbank",
      heading: "Alles wat je moet weten",
      items: [
        {
          question: "Zit hosting en onderhoud inbegrepen?",
          answer: "Ja, alle pakketten bevatten veilige cloud-hosting, dagelijkse back-ups en automatische beveiligingsupdates.",
        },
        {
          question: "Zijn de websites geschikt voor mobiele apparaten?",
          answer: "Al onze componenten zijn volledig responsief en getest op smartphones, tablets en brede desktopschermen.",
        },
        {
          question: "Hoe zit het met privacy en AVG-wetgeving?",
          answer: "We hosten binnen de EU, slaan geen onnodige cookies op en voorzien je website van een privacyverklaring.",
        },
        {
          question: "Kan ik mijn eigen domeinnaam meenemen?",
          answer: "Zeker, we koppelen je bestaande domeinnaam eenvoudig aan de nieuwe omgeving met gratis SSL-certificaat.",
        },
      ],
    },
    settings: {
      maxWidth: "large",
      background: "off-white",
    },
  },
  {
    name: "Kaarten overzicht",
    variant: "cards",
    content: {
      heading: "Veelgestelde vragen",
      items: [
        {
          question: "Kan ik meerdere gebruikers toegang geven?",
          answer: "Je kunt beheerders en redacteuren toevoegen met verschillende rechten via het dashboard.",
        },
        {
          question: "Wat gebeurt er als ik opzeg?",
          answer: "Je kunt maandelijks opzeggen en je content eenvoudig exporteren.",
        },
        {
          question: "Bieden jullie ondersteuning bij problemen?",
          answer: "Ons supportteam staat op werkdagen telefonisch en per e-mail klaar om vragen direct op te lossen.",
        },
      ],
    },
    settings: {
      maxWidth: "large",
    },
  },
];
