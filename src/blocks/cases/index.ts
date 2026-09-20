import { defineBlock } from "../contract";
import { Cases } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const cases = defineBlock({
  slug: "cases",
  label: "Cases",
  description: "Projecten of klantverhalen als kaarten met beeld, klant, samenvatting en tags.",
  category: "Vertrouwen",
  icon: "briefcase",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Cases,
});
