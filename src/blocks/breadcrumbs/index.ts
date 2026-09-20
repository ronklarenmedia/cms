import { defineBlock } from "../contract";
import { Breadcrumbs } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const breadcrumbs = defineBlock({
  slug: "breadcrumbs",
  label: "Kruimelpad",
  description: "Toont waar de bezoeker zich bevindt, met links terug naar hogere niveaus.",
  category: "Navigatie",
  icon: "path",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Breadcrumbs,
});
