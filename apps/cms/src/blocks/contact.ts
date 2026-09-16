import type { Block } from "payload";

// Grootste onbebouwde categorie uit de section.express-CSV (101 voorbeelden).
// 3 duidelijk terugkerende patronen als variant i.p.v. 3 losse blocktypes
// (zie doc §7-principe): een formulier met een info-kaart ernaast, een
// split met afbeelding/kaart, en een grid met meerdere vestigingen.
export const Contact: Block = {
  slug: "contact",
  labels: { singular: "Contact", plural: "Contact" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "formInfo",
      options: [
        { label: "Formulier + infokaart", value: "formInfo" },
        { label: "Split (afbeelding + formulier)", value: "split" },
        { label: "Vestigingen-grid", value: "locations" },
      ],
    },
    { name: "eyebrow", type: "text", label: "Kicker", admin: { description: "Bijv. 'NEEM CONTACT OP'. Optioneel." } },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Afbeelding (alleen bij Split)",
      admin: { condition: (_, siblingData) => siblingData?.variant === "split" },
    },
    {
      name: "submitLabel",
      type: "text",
      defaultValue: "Verstuur bericht",
      admin: { condition: (_, siblingData) => siblingData?.variant !== "locations" },
    },
    {
      name: "formAction",
      type: "text",
      label: "Formulier-actie (URL)",
      admin: {
        description: "Optioneel — endpoint waar het formulier naartoe post (bijv. Formspree-URL). Leeg = niet-functioneel voorbeeld.",
        condition: (_, siblingData) => siblingData?.variant !== "locations",
      },
    },
    {
      name: "contactInfo",
      type: "array",
      label: "Contactgegevens",
      labels: { singular: "Item", plural: "Contactgegevens" },
      admin: { condition: (_, siblingData) => siblingData?.variant === "formInfo" },
      fields: [
        { name: "icon", type: "text", admin: { description: "Emoji of korte tekst, bijv. '📍' of '☎'." } },
        { name: "label", type: "text", required: true, admin: { description: "Bijv. 'Adres', 'Telefoon', 'E-mail'." } },
        { name: "value", type: "text", required: true },
      ],
    },
    {
      name: "locations",
      type: "array",
      label: "Vestigingen",
      labels: { singular: "Vestiging", plural: "Vestigingen" },
      minRows: 1,
      admin: { condition: (_, siblingData) => siblingData?.variant === "locations" },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "phone", type: "text" },
        { name: "email", type: "text" },
        { name: "address", type: "text" },
        {
          name: "cta",
          type: "group",
          label: "Knop",
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
      ],
    },
  ],
};
