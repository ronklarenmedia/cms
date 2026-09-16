import type { Block } from "payload";

// 4e-grootste categorie in de section.express-CSV (125), miste nog in het
// blokkenplan. Genummerde stappen ("hoe het werkt"), 3 varianten die in de
// screenshots steeds terugkwamen: met afbeelding + badge, met icoon +
// vervaagd cijfer op de achtergrond, of kaal met alleen een klein cijfer.
export const StepBox: Block = {
  slug: "stepBox",
  labels: { singular: "Stappen", plural: "Stappen" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "icon",
      options: [
        { label: "Afbeelding + nummerbadge", value: "image" },
        { label: "Icoon + vervaagd cijfer", value: "icon" },
        { label: "Kaal (klein cijfer)", value: "numbered" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "cta",
      type: "group",
      label: "Knop naast de kop (optioneel)",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
    {
      name: "steps",
      type: "array",
      label: "Stappen",
      minRows: 1,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: { description: "Gebruikt bij variant 'Afbeelding + nummerbadge'." },
        },
        {
          name: "icon",
          type: "text",
          label: "Icoon",
          admin: { description: "Emoji of korte tekst als icoon." },
        },
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
  ],
};
