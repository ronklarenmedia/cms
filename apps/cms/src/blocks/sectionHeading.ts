import type { Block } from "payload";

// Introblok boven een sectie (kicker/heading/subheading + uitlijning).
// Zeer gangbaar patroon (zie theme-field-schema skill §A "Koppen") — geen
// los "Kickstart"-bloktype nodig, dat valt hieronder als variant.
export const SectionHeading: Block = {
  slug: "sectionHeading",
  labels: { singular: "Sectiekop", plural: "Sectiekoppen" },
  fields: [
    {
      name: "align",
      type: "radio",
      defaultValue: "center",
      options: [
        { label: "Links", value: "left" },
        { label: "Gecentreerd", value: "center" },
      ],
    },
    {
      name: "eyebrow",
      type: "text",
      label: "Kicker (klein label boven de titel)",
      admin: { description: "Bijv. 'DIENSTEN' of 'WAAROM WIJ'. Optioneel." },
    },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
  ],
};
