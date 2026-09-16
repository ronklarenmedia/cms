import type { Block } from "payload";

export const LogoBar: Block = {
  slug: "logoBar",
  labels: { singular: "Logo's-balk", plural: "Logo's-balken" },
  fields: [
    { name: "heading", type: "text", admin: { description: "Bijv. 'Vertrouwd door'. Optioneel." } },
    {
      name: "logos",
      type: "array",
      label: "Logo's",
      minRows: 1,
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "name", type: "text", admin: { description: "Bedrijfsnaam, voor alt-tekst." } },
        { name: "href", type: "text", admin: { description: "Optionele link naar de klant/partner." } },
      ],
    },
  ],
};
