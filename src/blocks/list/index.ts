import { defineBlock } from "../contract";
import { List } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const list = defineBlock({
  slug: "list",
  label: "Lijst",
  description: "Gestapelde rijen met een titel en optioneel label, tekst, tags en link.",
  category: "Content",
  icon: "list-bullets",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: List,
});
