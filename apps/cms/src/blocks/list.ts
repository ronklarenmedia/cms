import type { Block } from "payload";

// 43 voorbeelden in de CSV: gestapelde rijen gescheiden door lijntjes. 2
// varianten — uitgebreid (label + titel + tekst + pijl) en simpel (titel +
// tags rechts) — als select i.p.v. 2 blocktypes.
export const List: Block = {
  slug: "list",
  labels: { singular: "Lijst", plural: "Lijsten" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "detailed",
      options: [
        { label: "Uitgebreid (label + tekst + pijl)", value: "detailed" },
        { label: "Simpel (titel + tags)", value: "simple" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    {
      name: "items",
      type: "array",
      label: "Items",
      minRows: 1,
      fields: [
        { name: "tag", type: "text", admin: { description: "Klein label links. Alleen bij 'Uitgebreid'." } },
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", admin: { description: "Alleen bij 'Uitgebreid'." } },
        { name: "href", type: "text", admin: { description: "Optioneel — toont een pijl als dit is ingevuld." } },
        {
          name: "tags",
          type: "array",
          label: "Tags",
          admin: { description: "Alleen bij 'Simpel'." },
          fields: [{ name: "text", type: "text", required: true }],
        },
      ],
    },
  ],
};
