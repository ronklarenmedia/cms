import { defineBlock } from "../contract";
import { Tabs } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const tabs = defineBlock({
  slug: "tabs",
  label: "Tabs",
  description: "Inhoud verdeeld over tabbladen; wisselen werkt zonder JavaScript (radio-knoppen).",
  category: "Content",
  icon: "browsers",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Tabs,
});
