import type { CollectionConfig } from "payload";
import { themeFields } from "./fields/themeFields";
import { blocks } from "../blocks";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "site", "slug", "_status", "updatedAt"],
    group: "Klanten & Sites",
    description: "Pagina's van ALLE sites staan hier samen (centrale database). Gebruik de 'site'-kolom of het filter om te scopen naar één klant.",
  },
  versions: {
    drafts: true, // opslaan = concept, publiceren = live + rebuild-hook (zie doc §4)
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === "admin" ? true : { site: { equals: user?.site } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "site", type: "relationship", relationTo: "sites", required: true },
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
      ],
    },
    {
      name: "themeOverrides",
      type: "group",
      admin: { description: "Alles hier is optioneel — leeg = erf van de site-instellingen." },
      fields: themeFields(),
    },
    {
      name: "sections",
      type: "array",
      labels: { singular: "Sectie", plural: "Secties" },
      fields: [
        {
          name: "width",
          type: "select",
          defaultValue: "contained",
          options: [
            { label: "Full-width", value: "full" },
            { label: "Gecontaineerd", value: "contained" },
            { label: "Custom", value: "custom" },
          ],
        },
        {
          name: "layout",
          type: "select",
          defaultValue: "1-col",
          options: [
            { label: "1 kolom", value: "1-col" },
            { label: "2 kolommen 50/50", value: "2-col-50-50" },
            { label: "2 kolommen 30/70", value: "2-col-30-70" },
          ],
        },
        { name: "background", type: "text" },
        {
          // Gereserveerd, pas te implementeren in een latere versie (±v0.7,
          // zie doc §5) — nu alleen het veld zodat dit geen breaking change wordt.
          name: "divider",
          type: "group",
          fields: [
            {
              name: "type",
              type: "select",
              defaultValue: "none",
              options: [
                { label: "Geen", value: "none" },
                { label: "Golf", value: "wave" },
                { label: "Diagonaal", value: "diagonal" },
                { label: "Curve", value: "curve" },
              ],
            },
            { name: "color", type: "text" },
          ],
        },
        { name: "blocks", type: "blocks", blocks },
      ],
    },
  ],
};
