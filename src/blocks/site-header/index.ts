import { defineBlock } from "../contract";
import { SiteHeader } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const siteHeader = defineBlock({
  slug: "site-header",
  label: "Site-header",
  description: "Sitebrede kop met logo, menu (met uitklapmenu's) en één knop. Wordt op elke pagina getoond.",
  category: "Navigatie",
  icon: "list",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: SiteHeader,
});
