import type { Block } from "payload";

// 74 voorbeelden in de CSV. 2 duidelijk terugkerende patronen: ronde
// avatar-kaarten met bio + CTA + e-mail, of rechthoekige portretfoto's met
// naam/functie + social-iconen (zie doc §7-principe: variant i.p.v. 2 blocks).
export const TeamGrid: Block = {
  slug: "teamGrid",
  labels: { singular: "Team-grid", plural: "Team-grids" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "cards",
      options: [
        { label: "Kaarten (ronde avatar + bio + knop)", value: "cards" },
        { label: "Portretfoto's (naam/functie + social-iconen)", value: "photo" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "cta",
      type: "group",
      label: "Knop naast de kop (optioneel, alleen bij Portretfoto's)",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
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
      name: "members",
      type: "array",
      label: "Teamleden",
      minRows: 1,
      fields: [
        { name: "photo", type: "upload", relationTo: "media" },
        { name: "name", type: "text", required: true },
        { name: "role", type: "text" },
        { name: "bio", type: "textarea", admin: { description: "Alleen gebruikt bij variant 'Kaarten'." } },
        { name: "email", type: "text", admin: { description: "Alleen gebruikt bij variant 'Kaarten'." } },
        {
          name: "ctaLabel",
          type: "text",
          label: "Knoptekst",
          admin: { description: "Alleen gebruikt bij variant 'Kaarten'. Bijv. 'Meer info'." },
        },
        {
          name: "socials",
          type: "array",
          label: "Social-links",
          admin: { description: "Alleen gebruikt bij variant 'Portretfoto's'." },
          fields: [
            { name: "label", type: "text", required: true, admin: { description: "Bijv. 'Twitter' of '𝕏'." } },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
