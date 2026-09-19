import { defineBlock } from "../contract";
import { Stats } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const stats = defineBlock({
  slug: "stats",
  label: "Statistieken",
  description: "Rij of raster van kengetallen met labels en optionele toelichting.",
  category: "Content",
  icon: "chart-bar",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Stats,
});
