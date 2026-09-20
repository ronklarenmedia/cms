import { defineBlock } from "../contract";
import { Gallery } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const gallery = defineBlock({
  slug: "gallery",
  label: "Galerij",
  description: "Beelden met bijschrift in een raster, bento-indeling of metselwerk.",
  category: "Media",
  icon: "images",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Gallery,
});
