import { defineBlock } from "../contract";
import { SectionHeading } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const sectionHeading = defineBlock({
  slug: "section-heading",
  label: "Sectiekop",
  description: "Introductiekop voor een pagina-sectie met optionele eyebrow, introductietekst en actieknop.",
  category: "Content",
  icon: "text-h-two",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: SectionHeading,
});
