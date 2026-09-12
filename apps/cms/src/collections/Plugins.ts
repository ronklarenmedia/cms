import type { CollectionConfig } from "payload";

// Catalogus van beschikbare plugins/integraties (roadmap: reserveringen,
// webshop, blog, nieuws, vacatures, portfolio, agenda, Google Reviews —
// zie doc §8). In v1 alleen de registratie-structuur, geen implementaties.
export const Plugins: CollectionConfig = {
  slug: "plugins",
  admin: {
    useAsTitle: "name",
    group: "Platform",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    {
      name: "status",
      type: "select",
      defaultValue: "planned",
      options: [
        { label: "Gepland", value: "planned" },
        { label: "Beschikbaar", value: "available" },
      ],
    },
    {
      name: "basePrice",
      type: "number",
      admin: {
        description: "Standaardprijs per maand (EUR) voor deze plugin — basis voor toekomstige automatische facturatie. Per site te overschrijven via Site Plugins.",
        step: 0.01,
      },
    },
  ],
};
