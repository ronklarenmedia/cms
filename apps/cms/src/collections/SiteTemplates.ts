import type { CollectionConfig } from "payload";
import { themeFields } from "./fields/themeFields";

// Kopieerpunt, geen levende koppeling (zie doc §6): de waarden hieruit
// worden bij het aanmaken van een site eenmalig gekopieerd via de
// copyTemplateOnCreate-hook op de sites-collectie.
export const SiteTemplates: CollectionConfig = {
  slug: "site-templates",
  admin: {
    useAsTitle: "name",
    group: "Platform",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "thumbnail", type: "upload", relationTo: "media" },
    { name: "theme", type: "group", fields: themeFields() },
  ],
};
