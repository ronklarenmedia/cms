import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { userRoles, type UserRole } from "@/db/schema";
import { auth } from "./auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customerId: string | null;
};

/** De ingelogde gebruiker, of null. Per request maar één keer opgezocht. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email } = session.user;
  const { role, customerId } = session.user as { role?: string; customerId?: string | null };
  // Een onbekende rol (bijv. handmatig in de database gezet) geeft nooit toegang.
  if (!userRoles.includes(role as UserRole)) return null;
  return { id, name, email, role: role as UserRole, customerId: customerId ?? null };
});

/** Personeel: platform-admin of medewerker. Klantgebruikers hebben (nog) geen toegang tot het beheerdeel. */
export async function staffUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && user.role !== "klantgebruiker" ? user : null;
}

/** Voor pagina's en formulier-acties: stuurt anderen naar het inlogscherm. */
export async function requireStaff(): Promise<SessionUser> {
  const user = await staffUser();
  if (!user) redirect("/login");
  return user;
}

/** Voor destructieve acties (verwijderen): alleen een platform-admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireStaff();
  if (user.role !== "platform-admin") throw new Error("Alleen een platform-admin mag dit.");
  return user;
}

export const NOT_LOGGED_IN = "Je bent niet (meer) ingelogd. Log in via een ander tabblad; je wijzigingen blijven hier staan.";
