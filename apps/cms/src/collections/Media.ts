import type { CollectionConfig } from "payload";

// Opslag loopt via de S3-adapter naar Cloudflare R2 (zie payload.config.ts
// en het architectuurdocument §3) — hier alleen het schema.
export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};
