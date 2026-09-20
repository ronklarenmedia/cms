import { defineBlock } from "../contract";
import { Timeline } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const timeline = defineBlock({
  slug: "timeline",
  label: "Tijdlijn",
  description: "Momenten met een datum op een tijdlijn: geschiedenis, mijlpalen of planning.",
  category: "Content",
  icon: "clock-counter-clockwise",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Timeline,
});
