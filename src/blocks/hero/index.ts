import { defineBlock } from "../contract";
import { Hero } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const hero = defineBlock({
  slug: "hero",
  label: "Hero",
  description: "Openingssectie met kop, tekst, knoppen en beeld. Het enige block met een <h1>.",
  category: "Hero's",
  icon: "layout",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Hero,
});
