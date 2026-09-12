import type { CollectionConfig } from "payload";

export const SitePlugins: CollectionConfig = {
  slug: "site-plugins",
  admin: {
    useAsTitle: "id",
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
    { name: "settings", type: "json" },
  ],
};
