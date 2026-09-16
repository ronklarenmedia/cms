import type { Block } from "payload";

export const Testimonials: Block = {
  slug: "testimonials",
  labels: { singular: "Testimonials", plural: "Testimonials" },
  fields: [
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Eén grote quote", value: "single" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Testimonials",
      labels: { singular: "Testimonial", plural: "Testimonials" },
      minRows: 1,
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", label: "Functie / bedrijf" },
        { name: "avatar", type: "upload", relationTo: "media" },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          admin: { description: "1 t/m 5 sterren. Leeg = geen sterren tonen." },
        },
      ],
    },
  ],
};
