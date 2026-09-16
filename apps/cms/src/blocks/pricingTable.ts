import type { Block } from "payload";

// 56 voorbeelden in de CSV, vrijwel allemaal dezelfde kern-layout: N
// prijskaarten naast elkaar. De visuele variatie zit 'm in een uitgelichte
// kaart (featured), dus dat is een per-item vinkje i.p.v. een aparte
// blokvariant (zie doc §7-principe).
export const PricingTable: Block = {
  slug: "pricingTable",
  labels: { singular: "Prijstabel", plural: "Prijstabellen" },
  fields: [
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "tiers",
      type: "array",
      label: "Tarieven",
      minRows: 1,
      fields: [
        { name: "name", type: "text", required: true },
        { name: "price", type: "text", required: true, admin: { description: "Bijv. '€29' of 'Op aanvraag'." } },
        { name: "period", type: "text", admin: { description: "Bijv. 'per maand'. Optioneel." } },
        { name: "description", type: "textarea" },
        {
          name: "features",
          type: "array",
          label: "Inbegrepen",
          fields: [{ name: "text", type: "text", required: true }],
        },
        {
          name: "cta",
          type: "group",
          label: "Knop",
          fields: [
            { name: "label", type: "text", defaultValue: "Aan de slag" },
            { name: "href", type: "text" },
          ],
        },
        { name: "featured", type: "checkbox", label: "Uitgelicht", defaultValue: false },
        {
          name: "badge",
          type: "text",
          admin: { description: "Bijv. 'Meest gekozen'. Alleen zichtbaar als 'Uitgelicht' aanstaat." },
        },
      ],
    },
  ],
};
