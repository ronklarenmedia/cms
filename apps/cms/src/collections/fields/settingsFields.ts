import type { Field } from "payload";

// Site-brede instellingen: algemene info, SEO-defaults en analytics/integraties.
// Deze gelden als fallback voor losse pagina's (die eigen SEO-velden kunnen overschrijven).
export function generalSettingsFields(): Field[] {
  return [
    { name: "siteName", type: "text", label: "Sitenaam" },
    { name: "favicon", type: "upload", relationTo: "media", label: "Favicon" },
    {
      name: "locale",
      type: "select",
      label: "Taal",
      defaultValue: "nl",
      options: [
        { label: "Nederlands", value: "nl" },
        { label: "Engels", value: "en" },
      ],
    },
  ];
}

export function seoSettingsFields(): Field[] {
  return [
    {
      name: "metaTitle",
      type: "text",
      label: "Standaard meta title",
      admin: { description: "Gebruikt wanneer een pagina geen eigen meta title heeft." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Standaard meta description",
      admin: { description: "Gebruikt wanneer een pagina geen eigen meta description heeft." },
    },
    { name: "ogImage", type: "upload", relationTo: "media", label: "Standaard OG-afbeelding" },
  ];
}

export function analyticsSettingsFields(): Field[] {
  return [
    {
      name: "gaId",
      type: "text",
      label: "Google Analytics ID",
      admin: { description: "Bijv. G-XXXXXXXXXX." },
    },
    {
      name: "headScripts",
      type: "textarea",
      label: "Extra scripts in <head>",
      admin: { description: "Ruwe HTML/script-tags, bijv. voor Google Tag Manager of andere tracking." },
    },
  ];
}
