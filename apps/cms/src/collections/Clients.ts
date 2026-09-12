import type { CollectionConfig } from "payload";

export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
    group: "Klanten & Sites",
    defaultColumns: ["name", "brand", "status", "updatedAt"],
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
    {
      name: "billing",
      type: "group",
      label: "Facturatiegegevens",
      admin: {
        description: "Voorbereiding op (deels) automatische facturatie, later eventueel gekoppeld aan Moneybird e.d.",
      },
      fields: [
        { name: "companyName", type: "text", label: "Bedrijfsnaam" },
        { name: "kvkNumber", type: "text", label: "KvK-nummer" },
        { name: "vatNumber", type: "text", label: "BTW-nummer" },
        { name: "billingEmail", type: "email", label: "Factuur-e-mailadres" },
        {
          name: "address",
          type: "group",
          label: "Factuuradres",
          fields: [
            { name: "street", type: "text", label: "Straat + huisnummer" },
            { name: "postalCode", type: "text", label: "Postcode" },
            { name: "city", type: "text", label: "Plaats" },
            { name: "country", type: "text", label: "Land", defaultValue: "Nederland" },
          ],
        },
        {
          name: "externalAccountingId",
          type: "text",
          label: "Externe boekhoud-referentie",
          admin: {
            description: "Bijv. het relatie-ID in Moneybird zodra die koppeling er is. Nu nog leeg/handmatig.",
          },
        },
      ],
    },
  ],
};
