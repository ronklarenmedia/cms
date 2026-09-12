import type { CollectionConfig } from "payload";

// Opslag loopt via de S3-adapter naar Cloudflare R2 (zie payload.config.ts
// en het architectuurdocument §3) — hier alleen het schema.
export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  admin: {
    group: "Klanten & Sites",
    defaultColumns: ["filename", "site", "alt", "updatedAt"],
  },
  access: {
    // Publiek leesbaar: de Astro-site heeft geen auth en moet media kunnen tonen.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) =>
      user?.role === "admin" ? true : { site: { equals: user?.site } },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "site", type: "relationship", relationTo: "sites", required: true },
    {
      name: "alt",
      type: "text",
    },
  ],
};
