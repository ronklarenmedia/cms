import type { CollectionConfig } from "payload";
import { themeFields } from "./fields/themeFields";
import { copyTemplateOnCreate } from "../hooks/copyTemplateOnCreate";

export const Sites: CollectionConfig = {
  slug: "sites",
  admin: {
    useAsTitle: "domain",
    group: "Klanten & Sites",
    defaultColumns: ["domain", "client", "plan", "billing.billingStatus", "updatedAt"],
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === "admin" ? true : { id: { equals: user?.site } },
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeChange: [copyTemplateOnCreate],
  },
  fields: [
    {
      name: "quickLinks",
      type: "ui",
      admin: {
        components: {
          Field: "/src/components/SiteQuickLinks#SiteQuickLinks",
        },
      },
    },
    { name: "domain", type: "text", required: true, unique: true },
    { name: "client", type: "relationship", relationTo: "clients", required: true },
    {
      name: "startingTemplate",
      type: "relationship",
      relationTo: "site-templates",
      admin: {
        description: "Alleen gebruikt bij het aanmaken — kopieert het sjabloon eenmalig naar 'theme' hieronder.",
      },
    },
    { name: "theme", type: "group", fields: themeFields() },
    {
      name: "plan",
      type: "select",
      required: true,
      defaultValue: "budget",
      options: [
        { label: "Bodemprijs", value: "budget" },
        { label: "Premium", value: "premium" },
      ],
    },
    {
      name: "updateChannel",
      type: "select",
      required: true,
      defaultValue: "stable",
      admin: {
        description: "stable = periodiek/beproefd, early = nieuwe bloktypes direct (zie doc §10).",
      },
      options: [
        { label: "Stable", value: "stable" },
        { label: "Vroege toegang", value: "early" },
      ],
    },
    {
      name: "billing",
      type: "group",
      label: "Facturatie",
      admin: {
        description: "Voorbereiding op automatische facturatie: abonnementsprijs en -status van deze site.",
      },
      fields: [
        {
          name: "basePrice",
          type: "number",
          label: "Abonnementsprijs (EUR/maand)",
          admin: { step: 0.01 },
        },
        {
          name: "billingCycle",
          type: "select",
          label: "Factureringscyclus",
          defaultValue: "monthly",
          options: [
            { label: "Maandelijks", value: "monthly" },
            { label: "Jaarlijks", value: "yearly" },
          ],
        },
        {
          name: "billingStatus",
          type: "select",
          label: "Factureringsstatus",
          defaultValue: "active",
          options: [
            { label: "Actief", value: "active" },
            { label: "Gepauzeerd", value: "paused" },
            { label: "Opgezegd", value: "cancelled" },
          ],
        },
        {
          name: "subscriptionStartDate",
          type: "date",
          label: "Startdatum abonnement",
        },
      ],
    },
    {
      name: "vercel",
      type: "group",
      fields: [
        { name: "projectId", type: "text" },
        { name: "deployHookUrl", type: "text" },
      ],
    },
  ],
};
