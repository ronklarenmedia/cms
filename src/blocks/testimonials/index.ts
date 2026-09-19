import { defineBlock } from "../contract";
import { Testimonials } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const testimonials = defineBlock({
  slug: "testimonials",
  label: "Testimonials",
  description: "Ervaringen van klanten of gebruikers in een raster, kaarten of als uitgelichte quote.",
  category: "Vertrouwen",
  icon: "quotes",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Testimonials,
});
