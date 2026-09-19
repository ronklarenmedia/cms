"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { staffUser } from "@/lib/session";

const BASE = "/instellingen/beveiliging";

/** Beëindigt één van je eigen andere sessies. Better Auth zoekt de sessie alleen onder je eigen account. */
export async function revokeSession(formData: FormData) {
  if (!(await staffUser())) redirect("/login");
  const token = String(formData.get("token") ?? "");
  if (!token) redirect(`${BASE}?fout=onbekend`);

  const h = await headers();
  // De huidige sessie beëindig je met uitloggen, niet hier: zo gaat er niets stil mis.
  const current = await auth.api.getSession({ headers: h });
  if (current?.session.token === token) redirect(`${BASE}?fout=huidig`);

  try {
    await auth.api.revokeSession({ headers: h, body: { token } });
  } catch {
    redirect(`${BASE}?fout=onbekend`);
  }
  revalidatePath(BASE);
  redirect(`${BASE}?ok=sessie`);
}

/** Uitloggen op alle andere apparaten; deze sessie blijft actief. */
export async function revokeOtherSessions() {
  if (!(await staffUser())) redirect("/login");
  await auth.api.revokeOtherSessions({ headers: await headers() });
  revalidatePath(BASE);
  redirect(`${BASE}?ok=anderen`);
}
