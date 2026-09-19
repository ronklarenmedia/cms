import type { CtaBannerFixture } from "./schema";

export const fixtures: CtaBannerFixture[] = [
  {
    name: "Gecentreerd met tekst en twee knoppen",
    variant: "centered",
    content: {
      heading: "Klaar om te beginnen?",
      body: "Plan een vrijblijvend gesprek en ontdek wat we voor je kunnen bouwen.",
      buttons: [
        { label: "Plan een gesprek", href: "/contact", style: "primary" },
        { label: "Bekijk prijzen", href: "/prijzen", style: "secondary" },
      ],
    },
  },
  {
    name: "Split op zachte achtergrond",
    variant: "split",
    content: {
      heading: "Liever eerst even bellen?",
      body: "We reageren binnen één werkdag.",
      buttons: [{ label: "Neem contact op", href: "/contact", style: "primary" }],
    },
    settings: { background: "primary-light" },
  },
  {
    name: "Minimaal (kop en één knop)",
    variant: "centered",
    content: { heading: "Start vandaag", buttons: [{ label: "Aan de slag", href: "/start" }] },
  },
];
