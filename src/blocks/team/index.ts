import { defineBlock } from "../contract";
import { Team } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const team = defineBlock({
  slug: "team",
  label: "Teamleden",
  description: "Voorstelling van teamleden met foto, naam, functie en optionele bio.",
  category: "Vertrouwen",
  icon: "users",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Team,
});
