import type { CollectionConfig } from "payload";

// Urenregistratie: zowel platform-onderhoud (niet doorbelast) als
// klantspecifiek betaald werk. Basis voor toekomstige automatische
// facturatie (zie doc §10, "kwartiertje onderhoud" per maand).
export const TimeEntries: CollectionConfig = {
  slug: "time-entries",
  labels: { singular: "Uren", plural: "Uren" },
  admin: {
    useAsTitle: "description",
    group: "Administratie",
    defaultColumns: ["client", "site", "date", "minutes", "billable", "invoiced"],
    description: "Tijdregistratie per kwartier. 'Doorbelasten' aanvinken voor werk dat bij de klant in rekening gebracht moet worden.",
  },
  access: {
    read: ({ req: { user } }) =>
      user?.role === "admin" ? true : { site: { equals: user?.site } },
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "client", type: "relationship", relationTo: "clients", required: true },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      admin: { description: "Optioneel: leeg laten voor algemeen klantwerk dat niet aan één site hangt." },
    },
    { name: "date", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    {
      name: "minutes",
      type: "number",
      required: true,
      admin: { description: "In minuten, bij voorkeur afgerond op kwartieren (15/30/45/60)." },
    },
    { name: "description", type: "text", required: true },
    {
      name: "billable",
      type: "checkbox",
      label: "Doorbelasten aan klant",
      defaultValue: true,
      admin: { description: "Uit = telt als eigen platformonderhoud, niet als klantwerk." },
    },
    {
      name: "invoiced",
      type: "checkbox",
      label: "Gefactureerd",
      defaultValue: false,
      admin: { description: "Handmatig (of later automatisch) aan te vinken zodra dit is meegenomen in een factuur." },
    },
  ],
};
