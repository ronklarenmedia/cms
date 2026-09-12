import type { Block } from "payload";

// Varianten zijn een instellingenveld op dit ene bloktype, geen apart
// component per variant (ontwerpprincipe, zie doc §7).
export const Hero: Block = {
  slug: "hero",
  labels: { singular: "Hero", plural: "Hero's" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "centered",
      options: [
        { label: "Gecentreerd", value: "centered" },
        { label: "Split (tekst + afbeelding)", value: "split" },
        { label: "Video-achtergrond", value: "video-bg" },
        { label: "Full-bleed afbeelding", value: "full-bleed" },
      ],
    },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};
