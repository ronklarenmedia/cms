import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, sites } from "@/db/schema";
import { MockupScreen } from "@/mockup/MockupScreen";
import { requireStaff } from "@/lib/session";

export default async function WebsitesPage() {
  await requireStaff(); // controle op de sessie; maakt de pagina ook dynamisch (live database-data)
  const rows = await db
    .select({ id: sites.id, name: sites.name, status: sites.status, customerName: customers.name })
    .from(sites)
    .innerJoin(customers, eq(customers.id, sites.customerId))
    .orderBy(asc(sites.name));

  // Tuples [naam, klant, status, href], de vorm die de galerij uit de mockup verwacht.
  const list = rows.map((s) => [s.name, s.customerName, s.status === "live" ? "Live" : "Concept", `/websites/${s.id}`]);

  return <MockupScreen active="websites" title="Websites" sites={list} />;
}
