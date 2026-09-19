import { defineBlock } from "../contract";
import { SiteFooter } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const siteFooter = defineBlock({
  slug: "site-footer",
  label: "Site-footer",
  description: "Sitebrede afsluiter met naam, linkkolommen, contactgegevens en juridische links. Wordt op elke pagina getoond.",
  category: "Afsluiters",
  icon: "rows",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: SiteFooter,
});
