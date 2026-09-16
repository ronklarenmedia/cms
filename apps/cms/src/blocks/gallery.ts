import type { Block } from "payload";

// 42 voorbeelden in de CSV: van strakke uniforme grids tot bento-achtige
// grids met een enkele grote tegel. Eén grid met een optionele "span" per
// afbeelding dekt beide (CSS grid-column/row-span), geen aparte
// masonry-library nodig.
export const Gallery: Block = {
  slug: "gallery",
  labels: { singular: "Galerij", plural: "Galerijen" },
  fields: [
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text" },
    { name: "subheading", type: "textarea" },
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
      name: "images",
      type: "array",
      label: "Afbeeldingen",
      minRows: 1,
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text" },
        {
          name: "span",
          type: "select",
          defaultValue: "normal",
          label: "Grootte in de grid",
          options: [
            { label: "Normaal", value: "normal" },
            { label: "Breed (2 kolommen)", value: "wide" },
            { label: "Hoog (2 rijen)", value: "tall" },
          ],
        },
      ],
    },
  ],
};
