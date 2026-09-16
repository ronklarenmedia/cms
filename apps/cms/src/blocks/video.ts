import type { Block } from "payload";

// 33 voorbeelden in de CSV: poster-afbeelding met play-knop, soms met een
// rij iconen eronder. Ondersteunt zowel een geüpload mp4-bestand (native
// <video>, geen JS nodig) als een externe link (YouTube/Vimeo) die de
// play-knop opent.
export const Video: Block = {
  slug: "video",
  labels: { singular: "Video", plural: "Video's" },
  fields: [
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text" },
    { name: "subheading", type: "textarea" },
    { name: "poster", type: "upload", relationTo: "media", label: "Poster-afbeelding", required: true },
    {
      name: "videoFile",
      type: "upload",
      relationTo: "media",
      label: "Video-bestand (mp4)",
      admin: { description: "Voor directe afspelen op de pagina. Leeg laten als je 'Externe video-link' gebruikt." },
    },
    {
      name: "videoUrl",
      type: "text",
      label: "Externe video-link",
      admin: { description: "YouTube/Vimeo-URL — de play-knop linkt hiernaartoe als er geen video-bestand is." },
    },
    {
      name: "features",
      type: "array",
      label: "Iconen onder de video (optioneel)",
      fields: [
        { name: "icon", type: "text", admin: { description: "Emoji of korte tekst." } },
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea" },
      ],
    },
  ],
};
