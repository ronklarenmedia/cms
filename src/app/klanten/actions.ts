"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";

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
  const input = readCustomerInput(formData);
  await db.insert(customers).values(input);
  revalidatePath("/klanten");
  redirect("/klanten");
}

export async function updateCustomer(id: string, formData: FormData) {
  const input = readCustomerInput(formData);
  await db
    .update(customers)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(customers.id, id));
  revalidatePath("/klanten");
  redirect("/klanten");
}

export async function deleteCustomer(id: string) {
  await db.delete(customers).where(eq(customers.id, id));
  revalidatePath("/klanten");
  redirect("/klanten");
}
