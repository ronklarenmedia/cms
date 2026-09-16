import type { Block } from "payload";

// Grid van icoon/titel/tekst-items — dekt zowel "USP-grid", "icon-box" als
// "features" (section.express-taxonomie); het verschil is alleen het aantal
// kolommen, dus één bloktype met een kolommen-instelling i.p.v. drie aparte
// bloktypes (zelfde ontwerpprincipe als variant-velden, zie doc §7).
export const UspGrid: Block = {
  slug: "uspGrid",
  labels: { singular: "USP-grid", plural: "USP-grids" },
  fields: [
    {
      name: "columns",
      type: "select",
      defaultValue: "3",
      options: [
        { label: "2 kolommen", value: "2" },
        { label: "3 kolommen", value: "3" },
        { label: "4 kolommen", value: "4" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Items",
      minRows: 1,
      fields: [
        {
          name: "icon",
          type: "text",
          label: "Icoon",
          admin: { description: "Emoji of korte tekst als icoon, bijv. '⚡' of '24/7'." },
        },
        { name: "heading", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
  ],
};
