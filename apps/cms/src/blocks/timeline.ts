import type { Block } from "payload";

// 16 voorbeelden in de CSV: horizontale jaartallen-rij of een verticale
// zigzag-tijdlijn langs een middellijn — als variant op één blocktype.
export const Timeline: Block = {
  slug: "timeline",
  labels: { singular: "Tijdlijn", plural: "Tijdlijnen" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "horizontal",
      options: [
        { label: "Horizontaal (jaartallen naast elkaar)", value: "horizontal" },
        { label: "Verticaal (zigzag langs middellijn)", value: "vertical" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "items",
      type: "array",
      label: "Momenten",
      minRows: 1,
      fields: [
        { name: "date", type: "text", required: true, admin: { description: "Bijv. '2024' of 'Q1 2025'." } },
        { name: "icon", type: "text", admin: { description: "Emoji, alleen bij Verticaal." } },
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
        {
          name: "cta",
          type: "group",
          label: "Link (alleen bij Horizontaal)",
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
      ],
    },
  ],
};
