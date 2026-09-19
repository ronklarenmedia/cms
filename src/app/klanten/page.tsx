import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { MockupScreen } from "@/mockup/MockupScreen";

const plan = {
  pro: { label: "Pro", tag: "tag tag-accent" },
  bojob: { label: "BOJOB", tag: "tag tag-neutral" },
} as const;

const monogram = (name: string) =>
  name
    .split(" ")
    .filter((w) => /[a-z]/i.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default async function KlantenPage() {
  await connection(); // toont live database-data, dus niet voorrenderen bij de build
  const rows = await db.select().from(customers).orderBy(asc(customers.name));

  // Vorm van de roster uit de mockup; de kaarten tonen alleen wat het datamodel kent.
  const roster = rows.map((c) => ({
    id: c.id,
    name: c.name,
    cp: c.contactName,
    tel: c.phone ?? "—",
    mail: c.email,
    plan: plan[c.tier].label,
    planTag: plan[c.tier].tag,
    letter: c.name[0].toUpperCase(),
    monogram: monogram(c.name),
    services: c.status === "inactive" ? [{ label: "Inactief" }] : [],
  }));

  return <MockupScreen active="klanten" title="Klanten" roster={roster} />;
}
