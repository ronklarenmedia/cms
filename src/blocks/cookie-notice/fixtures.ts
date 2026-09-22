import type { CookieNoticeFixture } from "./schema";

export const fixtures: CookieNoticeFixture[] = [
  {
    name: "Balk onderaan met link naar privacypagina",
    variant: "bar",
    content: {
      heading: "Deze site gebruikt cookies",
      body: "We gebruiken alleen functionele cookies om de site goed te laten werken. Lees meer in ons",
      acceptLabel: "Akkoord",
      link: { label: "privacybeleid", href: "/privacy" },
    },
  },
  {
    name: "Kaart in de hoek (minimaal)",
    variant: "corner",
    content: {
      heading: "Cookies",
      body: "Deze site gebruikt alleen noodzakelijke cookies.",
      acceptLabel: "Begrepen",
    },
  },
];
