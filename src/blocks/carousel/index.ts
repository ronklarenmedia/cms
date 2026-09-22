import { defineBlock } from "../contract";
import { Carousel } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const carousel = defineBlock({
  slug: "carousel",
  label: "Carrousel",
  description: "Beelden die horizontaal doorscrollen met dia-navigatie; werkt zonder JavaScript (scroll-snap).",
  category: "Media",
  icon: "arrows-left-right",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Carousel,
});
