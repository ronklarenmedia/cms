import type { CollectionConfig } from "payload";

export const SitePlugins: CollectionConfig = {
  slug: "site-plugins",
  admin: {
    useAsTitle: "id",
    group: "Klanten & Sites",
    defaultColumns: ["site", "plugin", "active", "priceOverride"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "site", type: "relationship", relationTo: "sites", required: true },
    { name: "plugin", type: "relationship", relationTo: "plugins", required: true },
    { name: "active", type: "checkbox", defaultValue: true },
    {
      name: "priceOverride",
      type: "number",
      label: "Prijsafwijking (EUR/maand)",
      admin: {
        description: "Leeg = gebruik de standaardprijs van de plugin. Alleen invullen bij een klantspecifieke afspraak.",
        step: 0.01,
      },
    },
    {
      name: "activatedAt",
      type: "date",
      label: "Geactiveerd op",
      admin: { description: "Voor het bepalen van het eerste factuurmoment (proratie)." },
    },
    { name: "settings", type: "json" },
  ],
};
