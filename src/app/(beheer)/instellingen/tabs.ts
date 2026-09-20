// De tabs van Instellingen. Een tab met `planned` is nog niet gebouwd: hij toont wat er komt en waar dat op wacht,
// in plaats van schakelaars die niets doen.

export type PlannedTab = {
  intro: string;
  /** Waar de tab op wacht (besluit of ander onderdeel). */
  needs: string;
  items: string[];
};
export type SettingsTab = { slug: string; label: string; planned?: PlannedTab };

export const settingsTabs: readonly SettingsTab[] = [
  { slug: "algemeen", label: "Algemeen" },
  {
    slug: "thema",
    label: "Thema",
    planned: {
      intro: "Hoe dit beheerplatform eruitziet voor jou.",
      needs: "Komt per gebruiker (niet platformbreed) zodra het donkere thema er is.",
      items: [
        "Modus: licht, donker of volg het systeem",
        "Accentkleur en interfacedichtheid (compact, comfortabel, ruim)",
        "Startpagina na inloggen",
        "Menu ingeklapt onthouden",
      ],
    },
  },
  { slug: "koppelingen", label: "Koppelingen" },
  {
    slug: "ai",
    label: "AI",
    planned: {
      intro: "Model, gedrag en limieten voor de AI in de builder.",
      needs: "Wacht op de Anthropic-koppeling en de generator (AI-aanpassing in de builder staat nu uit).",
      items: [
        "Model voor generatie en voor korte aanpassingen, taal van de output",
        "Systeeminstructies",
        "Credits per plan en extra credits",
        "Mag een klant zelf sites genereren; eerst als concept; publiceren met of zonder goedkeuring",
        "Klantdata uitsluiten van modeltraining",
      ],
    },
  },
  { slug: "team", label: "Team & rollen" },
  {
    slug: "plannen",
    label: "Plannen & facturatie",
    planned: {
      intro: "Welke plannen er zijn, wat ze kosten en wat erin zit.",
      needs: "Wacht op het besluit over de plannen (BOJOB/PRO) en de keuze voor facturatie (Moneybird, Mollie of Stripe).",
      items: [
        "Plandefinities en prijzen, kortingen en proefperiode",
        "Limieten per plan (sites, apps, AI-credits)",
        "BTW en factuurgegevens",
        "Betaalmethoden en herinneringen",
      ],
    },
  },
  {
    slug: "domeinen",
    label: "Domeinen & DNS",
    planned: {
      intro: "Domeinen van klantsites en hun DNS.",
      needs: "Wacht op de keuze hoe klantsites worden gehost en op echt publiceren.",
      items: [
        "Standaarddomein voor werkruimtes",
        "Wildcard-DNS en SSL-uitgifte",
        "Aangepaste domeinen goedkeuren",
        "Redirect- en www-beleid",
      ],
    },
  },
  {
    slug: "publicatie",
    label: "Publicatie & omgevingen",
    planned: {
      intro: "Hoe en waar sites gepubliceerd worden.",
      needs: "Wacht op echt publiceren (nu wijzigt publiceren alleen de status).",
      items: [
        "Omgevingen: voorbeeld, staging, productie",
        "Build-hooks en deploy-limieten",
        "Automatisch publiceren na goedkeuring",
        "Terugrolbeleid en bewaartermijn van versies",
      ],
    },
  },
  {
    slug: "notificaties",
    label: "Notificaties & webhooks",
    planned: {
      intro: "Wie welke melding krijgt en welke systemen worden geïnformeerd.",
      needs: "Wacht op e-mailkoppeling (Resend) en echt publiceren.",
      items: [
        "E-mailafzender en sjablonen",
        "Slack- of Teams-kanaal per gebeurtenis",
        "Webhooks voor deploys en incidenten",
        "Abonnementen op de statuspagina",
      ],
    },
  },
  { slug: "beveiliging", label: "Beveiliging & logging" },
  {
    slug: "compliance",
    label: "Compliance & data",
    planned: {
      intro: "Privacy en gegevensbeheer voor het platform en de klanten.",
      needs: "Komt na de eerste klantsites die live staan.",
      items: [
        "Verwerkersovereenkomsten per klant",
        "Datalocatie en bewaartermijnen",
        "Cookiemelding en toestemming",
        "Uitvoer- en verwijderverzoeken (AVG)",
      ],
    },
  },
];

export const findTab = (slug: string) => settingsTabs.find((t) => t.slug === slug);
