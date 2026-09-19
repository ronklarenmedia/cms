import { asc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { customers, sites } from "@/db/schema";
import { MockupScreen } from "@/mockup/MockupScreen";

export default async function WebsitesPage() {
  await connection(); // toont live database-data, dus niet voorrenderen bij de build
  const rows = await db
    .select({ id: sites.id, name: sites.name, status: sites.status, customerName: customers.name })
    .from(sites)
    .innerJoin(customers, eq(customers.id, sites.customerId))
    .orderBy(asc(sites.name));

  // Tuples [naam, klant, status, href], de vorm die de galerij uit de mockup verwacht.
  const list = rows.map((s) => [s.name, s.customerName, s.status === "live" ? "Live" : "Concept", `/websites/${s.id}`]);

  return <MockupScreen active="websites" title="Websites" sites={list} />;
}
