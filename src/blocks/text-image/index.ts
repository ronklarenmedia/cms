import { defineBlock } from "../contract";
import { TextImage } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const textImage = defineBlock({
  slug: "text-image",
  label: "Tekst + Afbeelding",
  description: "Combinatie van tekst, optionele knoppen en een afbeelding (links of rechts).",
  category: "Content",
  icon: "image",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: TextImage,
});
