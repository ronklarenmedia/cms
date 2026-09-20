"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers, user, userRoles, type UserRole } from "@/db/schema";
import { staffUser } from "@/lib/session";

const BASE = "/instellingen/team";

/**
 * Rol (en bij een klantgebruiker de klant) van een gebruiker wijzigen. Alleen een platform-admin.
 * Server-acties zijn openbare endpoints: elke controle gebeurt hier, niet in het formulier.
 */
export async function updateUserRole(formData: FormData) {
  const actor = await staffUser();
  if (!actor) redirect("/login");
  if (actor.role !== "platform-admin") redirect(`${BASE}?fout=rechten`);

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;
  const customerId = String(formData.get("customerId") ?? "");

  if (!userRoles.includes(role)) redirect(`${BASE}?fout=rol`);
  // Zo kun je jezelf niet buitensluiten en blijft er altijd minstens één platform-admin over.
  if (userId === actor.id) redirect(`${BASE}?fout=zelf`);

  const [target] = await db.select({ id: user.id }).from(user).where(eq(user.id, userId));
  if (!target) redirect(`${BASE}?fout=onbekend`);

  let nextCustomerId: string | null = null;
  if (role === "klantgebruiker") {
    const [customer] = customerId
      ? await db.select({ id: customers.id }).from(customers).where(eq(customers.id, customerId))
      : [];
    if (!customer) redirect(`${BASE}?fout=klant`);
    nextCustomerId = customer.id;
  }

  await db.update(user).set({ role, customerId: nextCustomerId, updatedAt: new Date() }).where(eq(user.id, userId));
  revalidatePath(BASE);
  redirect(`${BASE}?ok=rol`);
}
