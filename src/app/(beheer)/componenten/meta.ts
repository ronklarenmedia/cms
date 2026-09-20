import type { Category, Status } from "@/blocks/contract";

/** Phosphor-icoon per categorie (zonder "ph-"). */
export const categoryIcons: Record<Category, string> = {
  Navigatie: "list",
  "Hero's": "layout",
  Content: "text-align-left",
  Media: "images-square",
  Formulieren: "textbox",
  Commerce: "shopping-bag",
  Vertrouwen: "seal-check",
  Afsluiters: "arrow-line-down",
};

export const statusMeta: Record<Status, { label: string; tag: string }> = {
  "kit-ready": { label: "Kit-ready", tag: "tag tag-neutral" },
  beta: { label: "Beta", tag: "tag tag-accent" },
  verouderd: { label: "Verouderd", tag: "tag tag-outline" },
};

export const categoryId = (category: string) => category.toLowerCase().replace(/[^a-z]/g, "");
