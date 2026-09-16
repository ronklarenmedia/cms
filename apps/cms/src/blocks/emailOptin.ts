import type { Block } from "payload";

// 31 voorbeelden in de CSV: nieuwsbrief-aanmelding. 2 varianten — split met
// afbeelding, of gecentreerd met een inline formulier.
export const EmailOptin: Block = {
  slug: "emailOptin",
  labels: { singular: "Nieuwsbrief-aanmelding", plural: "Nieuwsbrief-aanmeldingen" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "centered",
      options: [
        { label: "Gecentreerd (inline formulier)", value: "centered" },
        { label: "Split (afbeelding + formulier)", value: "split" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker" },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { condition: (_, siblingData) => siblingData?.variant === "split" },
    },
    { name: "showNameField", type: "checkbox", label: "Naamveld tonen", defaultValue: false },
    { name: "submitLabel", type: "text", defaultValue: "Aanmelden" },
    {
      name: "formAction",
      type: "text",
      label: "Formulier-actie (URL)",
      admin: { description: "Optioneel — endpoint waar het formulier naartoe post." },
    },
    { name: "disclaimer", type: "text", admin: { description: "Kleine tekst onder het formulier, bijv. privacy-mededeling." } },
  ],
};
