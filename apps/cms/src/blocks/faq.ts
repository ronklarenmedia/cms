import type { Block } from "payload";

// 23 voorbeelden in de CSV: meestal een accordion, soms met een afbeelding
// ernaast. 2 varianten; de accordion zelf rendert met native <details> (zie
// FAQ.astro), dus geen client-JS nodig.
export const Faq: Block = {
  slug: "faq",
  labels: { singular: "FAQ", plural: "FAQ's" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "centered",
      options: [
        { label: "Gecentreerd (1 kolom)", value: "centered" },
        { label: "Split (afbeelding + accordion)", value: "split" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { condition: (_, siblingData) => siblingData?.variant === "split" },
    },
    {
      name: "items",
      type: "array",
      label: "Vragen",
      minRows: 1,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
};
