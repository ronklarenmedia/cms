import type { Block } from "payload";

// Losstaande statistieken-rij (naast de ingebouwde variant binnen Hero
// "centered-proof") — zelfde velden, maar overal op de pagina te gebruiken,
// niet alleen direct onder de hero.
export const Stats: Block = {
  slug: "stats",
  labels: { singular: "Statistieken", plural: "Statistieken" },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Statistieken",
      labels: { singular: "Statistiek", plural: "Statistieken" },
      minRows: 1,
      fields: [
        { name: "value", type: "text", required: true, admin: { description: "Bijv. '500+' of '98%'." } },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
};
