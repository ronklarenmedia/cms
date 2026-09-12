import type { Field } from "payload";

// Gedeeld veldenschema voor "theme": gebruikt in site-templates, sites.theme
// en pages.themeOverrides (waar alles optioneel blijft — leeg = erf van
// het niveau erboven, zie doc §1).
export function themeFields({ requireValues = false }: { requireValues?: boolean } = {}): Field[] {
  return [
    {
      name: "colors",
      type: "group",
      fields: [
        { name: "primary", type: "text", required: requireValues },
        { name: "secondary", type: "text" },
        { name: "background", type: "text" },
        { name: "text", type: "text" },
      ],
    },
    {
      name: "fonts",
      type: "group",
      fields: [
        { name: "heading", type: "text" },
        { name: "body", type: "text" },
      ],
    },
    { name: "borderRadius", type: "text" },
    { name: "maxPageWidth", type: "text" },
  ];
}
