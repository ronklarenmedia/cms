import type { Block } from "payload";

// 14 voorbeelden in de CSV: een rij social-links, met of zonder "Follow
// us"-koptekst ernaast. Geen ingebedde social-feed (vereist third-party
// JS/embeds) — puur linkjes, content-only zoals de rest van de blocks.
export const Social: Block = {
  slug: "social",
  labels: { singular: "Social-links", plural: "Social-links" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "bar",
      options: [
        { label: "Balk (labels in vakjes)", value: "bar" },
        { label: "Koptekst + ronde iconen", value: "iconsRound" },
      ],
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "Follow Us",
      admin: { condition: (_, siblingData) => siblingData?.variant === "iconsRound" },
    },
    {
      name: "text",
      type: "textarea",
      admin: { condition: (_, siblingData) => siblingData?.variant === "iconsRound" },
    },
    {
      name: "links",
      type: "array",
      label: "Links",
      minRows: 1,
      fields: [
        { name: "label", type: "text", required: true, admin: { description: "Bijv. 'Instagram' of '📷'." } },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
};
