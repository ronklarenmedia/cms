import type { CollectionConfig } from "payload";

export const ApiConnections: CollectionConfig = {
  slug: "api-connections",
  admin: {
    useAsTitle: "name",
    group: "Platform",
  },
  access: {
    read: ({ req: { user } }) => user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "service", type: "text", required: true },
    { name: "notes", type: "textarea" },
  ],
};
