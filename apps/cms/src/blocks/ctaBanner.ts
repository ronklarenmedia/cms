import type { Block } from "payload";

export const CtaBanner: Block = {
  slug: "ctaBanner",
  labels: { singular: "CTA-banner", plural: "CTA-banners" },
  fields: [
    {
      name: "style",
      type: "select",
      defaultValue: "solid",
      options: [
        { label: "Gevuld (primaire kleur)", value: "solid" },
        { label: "Zacht (secundaire achtergrond)", value: "soft" },
      ],
    },
    { name: "heading", type: "text", required: true },
    { name: "text", type: "textarea" },
    {
      name: "cta",
      type: "group",
      label: "Knop",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "secondaryCta",
      type: "group",
      label: "Tweede knop (optioneel)",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
  ],
};
