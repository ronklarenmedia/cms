import { defineBlock } from "../contract";
import { Pricing } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const pricing = defineBlock({
  slug: "pricing",
  label: "Prijzen",
  description: "Vergelijking van tarieven en pakketten met prijzen, kenmerken en call-to-action.",
  category: "Commerce",
  icon: "currency-eur",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Pricing,
});
