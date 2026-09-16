import type { Block } from "payload";

// Dekt de CSV-categorieën "content" (23) en "text-box" (16) samen: gewone
// lopende tekst hoort één simpel richText-veld te zijn, geen losse
// per-eigenschap velden (zie .claude/skills/theme-field-schema/SKILL.md §B).
export const RichText: Block = {
  slug: "richText",
  labels: { singular: "Tekstblok", plural: "Tekstblokken" },
  fields: [
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text" },
    {
      name: "columns",
      type: "select",
      defaultValue: "1",
      label: "Tekstkolommen",
      options: [
        { label: "1 kolom", value: "1" },
        { label: "2 kolommen", value: "2" },
      ],
    },
    { name: "body", type: "richText", required: true },
  ],
};
