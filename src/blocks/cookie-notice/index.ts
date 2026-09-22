import { defineBlock } from "../contract";
import { CookieNotice } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const cookieNotice = defineBlock({
  slug: "cookie-notice",
  label: "Cookiemelding",
  description: "Vaste balk of kaart met een korte cookiemelding en een akkoord-knop. Hoort in de footer-slot, zodat hij op elke pagina van de site verschijnt.",
  category: "Vertrouwen",
  icon: "cookie",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: CookieNotice,
});
