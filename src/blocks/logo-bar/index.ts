import { defineBlock } from "../contract";
import { LogoBar } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const logoBar = defineBlock({
  slug: "logo-bar",
  label: "Logo-balk",
  description: "Rij of raster van partner- of klantlogo's met optionele links en kop.",
  category: "Vertrouwen",
  icon: "handshake",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: LogoBar,
});
