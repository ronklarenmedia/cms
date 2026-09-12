import type { Block } from "payload";

// Vervangt wat eerst als twee losse bloktypes ("Foto + Tekst" en
// "Tekst + Foto") bedacht was — het verschil is hier het "imagePosition"-
// instellingenveld (zie doc §7).
export const FotoTekst: Block = {
  slug: "fotoTekst",
  labels: { singular: "Foto + Tekst", plural: "Foto + Tekst" },
  fields: [
    {
      name: "imagePosition",
      type: "radio",
      defaultValue: "left",
      options: [
        { label: "Afbeelding links", value: "left" },
        { label: "Afbeelding rechts", value: "right" },
      ],
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "heading", type: "text" },
    { name: "text", type: "textarea" },
  ],
};
