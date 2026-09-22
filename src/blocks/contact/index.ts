import { defineBlock } from "../contract";
import { Contact } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const contact = defineBlock({
  slug: "contact",
  label: "Contact",
  description: "Adres, telefoon, e-mail en openingstijden, met optioneel een knop naar een routeplanner.",
  category: "Content",
  icon: "phone",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Contact,
});
