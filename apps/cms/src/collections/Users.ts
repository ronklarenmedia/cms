import type { CollectionConfig } from "payload";

// Payload's auth-collectie. Rol bepaalt scope: admin ziet alles, klant
// alleen de eigen site (zie access-control hieronder + doc §2/§5).
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Platform",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "client",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Klant", value: "client" },
      ],
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      admin: {
        condition: (data) => data?.role === "client",
        description: "Voor een klant-gebruiker: de site waartoe deze gebruiker toegang heeft.",
      },
    },
  ],
};
