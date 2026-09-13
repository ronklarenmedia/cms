import type { Block } from "payload";

// Varianten zijn een instellingenveld op dit ene bloktype, geen apart
// component per variant (ontwerpprincipe, zie doc §7).
//
// "centered-proof" toegevoegd n.a.v. analyse van een Elementor-hero
// (starter-templates.com/kitkit/k1780) — een gecentreerde hero met
// vertrouwensbadge, CTA-knop en een rij statistieken. Geen apart
// bloktype, gewoon extra (optionele) velden op deze ene Hero.
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
        { label: "Gecentreerd met bewijs (badge + statistieken)", value: "centered-proof" },
        { label: "Split (tekst + afbeelding)", value: "split" },
        { label: "Video-achtergrond", value: "video-bg" },
        { label: "Full-bleed afbeelding", value: "full-bleed" },
      ],
    },
    { name: "heading", type: "text", required: true },
    { name: "subheading", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "badge",
      type: "text",
      label: "Vertrouwensbadge",
      admin: { description: "Bijv. 'Vertrouwd door 10.000+ klanten'. Leeg = niet tonen." },
    },
    {
      name: "cta",
      type: "group",
      label: "Call-to-action knop",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "Statistieken",
      labels: { singular: "Statistiek", plural: "Statistieken" },
      admin: { description: "Optionele rij met kengetallen onder de hero, bijv. '500+ Projecten'." },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
};
