import { defineBlock } from "../contract";
import { Comparison } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const comparison = defineBlock({
  slug: "comparison",
  label: "Vergelijkingstabel",
  description: "Zet kolommen (bijv. pakketten) naast elkaar met rijen van kenmerken om te vergelijken.",
  category: "Content",
  icon: "table",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Comparison,
});
