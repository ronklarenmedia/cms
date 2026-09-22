import type { ContactFixture } from "./schema";

export const fixtures: ContactFixture[] = [
  {
    name: "Split met adres, telefoon en openingstijden",
    variant: "split",
    content: {
      eyebrow: "Contact",
      heading: "Kom langs of bel ons",
      intro: "We staan je graag te woord, telefonisch of op ons kantoor in Amersfoort.",
      address: "Stationsplein 12, 3811 MH Amersfoort",
      phone: "033 123 4567",
      email: "hallo@ronklarenmedia.nl",
      hours: [
        { day: "Maandag t/m vrijdag", time: "09:00 – 17:30" },
        { day: "Zaterdag en zondag", time: "Gesloten" },
      ],
      buttons: [{ label: "Route uitstippelen", href: "https://maps.google.com", style: "secondary" }],
    },
  },
  {
    name: "Kaarten naast elkaar",
    variant: "cards",
    content: {
      heading: "Zo bereik je ons",
      phone: "020 987 6543",
      email: "info@ronklarenmedia.nl",
      address: "Herengracht 1, 1015 Amsterdam",
    },
  },
  {
    name: "Gecentreerd (alleen e-mail)",
    variant: "centered",
    content: {
      heading: "Liever mailen?",
      email: "hallo@ronklarenmedia.nl",
    },
  },
];
