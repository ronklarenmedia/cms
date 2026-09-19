import { defineBlock } from "../contract";
import { CtaBanner } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const ctaBanner = defineBlock({
  slug: "cta-banner",
  label: "CTA-band",
  description: "Afsluitende oproep tot actie met kop, korte tekst en één of twee knoppen.",
  category: "Afsluiters",
  icon: "cursor-click",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: CtaBanner,
});
