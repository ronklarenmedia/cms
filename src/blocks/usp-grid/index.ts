import { defineBlock } from "../contract";
import { UspGrid } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const uspGrid = defineBlock({
  slug: "usp-grid",
  label: "USP-grid",
  description: "Rij of raster met korte voordelen: icoon, kop en tekst. Twee tot vier kolommen.",
  category: "Content",
  icon: "squares-four",
  status: "kit-ready",
  variants,
  content,
  settings,
  fixtures,
  Component: UspGrid,
});
