import type { CollectionConfig } from "payload";

export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: ({ req: { user } }) => user?.role === "admin",
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email" },
    { name: "phone", type: "text" },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "Actief", value: "active" },
        { label: "Inactief", value: "inactive" },
      ],
    },
    {
      name: "brand",
      type: "select",
      required: true,
      admin: { description: "Via welk merk/acquisitiekanaal deze klant binnenkwam." },
      options: [
        { label: "Bodemprijs-merk", value: "budget" },
        { label: "Persoonlijke-service-merk", value: "premium" },
      ],
    },
  ],
};
