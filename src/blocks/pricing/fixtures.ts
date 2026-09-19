import type { PricingFixture } from "./schema";

export const fixtures: PricingFixture[] = [
  {
    name: "Drie kaarten met uitgelichte optie",
    variant: "highlighted",
    content: {
      eyebrow: "Transparante tarieven",
      heading: "Kies het pakket dat bij je past",
      intro: "Geen verborgen kosten. Schaal flexibel op of af wanneer jouw onderneming groeit.",
      plans: [
        {
          name: "Starter",
          price: "€ 49",
          period: "per maand",
          description: "Ideaal voor zzp'ers en startende ondernemers.",
          features: [
            "Tot 5 pagina's",
            "Volledig mobiel responsief",
            "Contactformulier & SEO basis",
            "Beveiligde EU cloud-hosting",
          ],
          button: {
            label: "Kies Starter",
            href: "/aanmelden?plan=starter",
            style: "secondary",
          },
        },
        {
          name: "Professional",
          price: "€ 99",
          period: "per maand",
          description: "De meest gekozen keuze voor groeiende bedrijven.",
          badge: "Meest populair",
          highlighted: true,
          features: [
            "Onbeperkt aantal pagina's",
            "Geavanceerde SEO & analytics",
            "Alle 10+ premium componenten",
            "Prioriteitssupport binnen 4 uur",
            "Eigen domeinnaamkoppeling",
          ],
          button: {
            label: "Kies Professional",
            href: "/aanmelden?plan=professional",
            style: "primary",
          },
        },
        {
          name: "Maatwerk",
          price: "Op aanvraag",
          period: "per project",
          description: "Compleet ontzorgd met integraties op maat.",
          features: [
            "Volledig maatwerk ontwerp",
            "API-koppelingen & CRM integratie",
            "Toegewijde accountmanager",
            "SLA met 99.9% uptime garantie",
          ],
          button: {
            label: "Neem contact op",
            href: "/contact",
            style: "secondary",
          },
        },
      ],
    },
    settings: {
      maxWidth: "large",
    },
  },
  {
    name: "Standaard kaarten",
    variant: "cards",
    content: {
      heading: "Eenvoudige abonnementen",
      plans: [
        {
          name: "Basis",
          price: "€ 35",
          period: "per maand",
          features: ["Standaard componenten", "Snelle hosting", "SSL-beveiliging"],
          button: {
            label: "Aan de slag",
            href: "/aanmelden",
            style: "primary",
          },
        },
        {
          name: "Pro",
          price: "€ 75",
          period: "per maand",
          features: ["Alle componenten", "Dagelijkse back-ups", "Persoonlijke support"],
          button: {
            label: "Aan de slag",
            href: "/aanmelden",
            style: "primary",
          },
        },
      ],
    },
  },
  {
    name: "Minimalistisch",
    variant: "minimal",
    content: {
      eyebrow: "Prijzen",
      heading: "Duidelijk en overzichtelijk",
      plans: [
        {
          name: "Alles-in-één",
          price: "€ 89",
          period: "per maand",
          description: "Toegang tot alle functies zonder restricties.",
          features: ["Geen setupkosten", "Maandelijks opzegbaar", "Inclusief updates"],
          button: {
            label: "Start direct",
            href: "/aanmelden",
            style: "primary",
          },
        },
      ],
    },
  },
];
