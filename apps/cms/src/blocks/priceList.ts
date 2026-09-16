import type { Block } from "payload";

// 27 voorbeelden in de CSV — apart van pricingTable.ts: dit is een simpele
// dienst/gerecht-met-prijs-lijst (restaurant-menu-achtig), geen
// abonnementskaarten.
export const PriceList: Block = {
  slug: "priceList",
  labels: { singular: "Prijslijst", plural: "Prijslijsten" },
  fields: [
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "columns",
      type: "select",
      defaultValue: "2",
      options: [
        { label: "1 kolom", value: "1" },
        { label: "2 kolommen", value: "2" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "Items",
      minRows: 1,
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "name", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "price", type: "text", required: true, admin: { description: "Bijv. '€20' of 'Op aanvraag'." } },
      ],
    },
  ],
};
