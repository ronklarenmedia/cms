import { defineBlock } from "../contract";
import { Process } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const process = defineBlock({
  slug: "process",
  label: "Stappenplan",
  description: "Genummerde stappen die een werkwijze, proces of onboarding flow visualiseren.",
  category: "Content",
  icon: "steps",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Process,
});
