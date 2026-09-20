"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers, sites } from "@/db/schema";
import { requireAdmin, requireStaff } from "@/lib/session";

function readCustomerInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const tier = formData.get("tier") === "pro" ? "pro" : "bojob";
  const status = formData.get("status") === "inactive" ? "inactive" : "active";

  if (!name || !contactName || !email) {
    throw new Error("Naam, contactpersoon en e-mail zijn verplicht.");
  }

  return { name, contactName, email, phone: phone || null, tier, status } as const;
}

export async function createCustomer(formData: FormData) {
  await requireStaff();
  const input = readCustomerInput(formData);
  await db.insert(customers).values(input);
  revalidatePath("/klanten");
  redirect("/klanten");
}

export async function updateCustomer(id: string, formData: FormData) {
  await requireStaff();
  const input = readCustomerInput(formData);
  await db
    .update(customers)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(customers.id, id));
  revalidatePath("/klanten");
  redirect("/klanten");
}

const FOREIGN_KEY_VIOLATION = "23503";

/** Een klant met websites kan niet verwijderd worden: die websites zouden hun eigenaar verliezen. */
export async function deleteCustomer(id: string) {
  await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(sites).where(eq(sites.customerId, id));
  if (n > 0) redirect(`/klanten/${id}?fout=sites`);

  try {
    await db.delete(customers).where(eq(customers.id, id));
  } catch (e) {
    // Er kwam net een website bij tussen de controle en het verwijderen.
    if ((e as { code?: string }).code === FOREIGN_KEY_VIOLATION) redirect(`/klanten/${id}?fout=sites`);
    throw e;
  }
  revalidatePath("/klanten");
  redirect("/klanten");
}
