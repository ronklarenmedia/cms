import { defineBlock } from "../contract";
import { Faq } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const faq = defineBlock({
  slug: "faq",
  label: "Veelgestelde vragen",
  description: "Lijst of accordeon van veelgestelde vragen en antwoorden met optionele contactknop.",
  category: "Content",
  icon: "question",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: Faq,
});
