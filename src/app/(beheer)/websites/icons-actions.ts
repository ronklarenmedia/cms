"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { hostedIcons, type HostedIcon } from "@/db/schema";
import { fetchAndSanitizeIcon, IconError } from "@/lib/material-icons";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";

// Server-acties voor de on-demand Material Symbols-bibliotheek (zie src/lib/material-icons.ts). De tabel
// `hosted_icons` is platformbreed, dus elke medewerker mag hem lezen en aanvullen.

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const isUniqueViolation = (e: unknown): boolean => typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "23505";

/** Alle on-demand gehoste iconen, voor de zoek-picker en het canvas. Klein en platformbreed: alles in één keer. */
export async function listHostedIcons(): Promise<HostedIcon[]> {
  if (!(await staffUser())) return [];
  return db.select().from(hostedIcons).orderBy(asc(hostedIcons.name));
}

/** Haalt een Material Symbol op (als het nog niet gehost is) en geeft de rij terug. */
export async function fetchMaterialIcon(name: string): Promise<Result<{ icon: HostedIcon }>> {
  const user = await staffUser();
  if (!user) return { ok: false, error: NOT_LOGGED_IN };

  const [existing] = await db.select().from(hostedIcons).where(eq(hostedIcons.name, name));
  if (existing) return { ok: true, icon: existing };

  let svg: string;
  try {
    svg = await fetchAndSanitizeIcon(name);
  } catch (e) {
    if (e instanceof IconError) return { ok: false, error: e.message };
    console.error("Icoon ophalen mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Ophalen is mislukt. Probeer het opnieuw." };
  }

  try {
    const [row] = await db.insert(hostedIcons).values({ name, svg, createdBy: user.id }).returning();
    return { ok: true, icon: row };
  } catch (e) {
    // Race: een andere medewerker koos hetzelfde icoon tussen de lees- en schrijfstap.
    if (isUniqueViolation(e)) {
      const [race] = await db.select().from(hostedIcons).where(eq(hostedIcons.name, name));
      if (race) return { ok: true, icon: race };
    }
    console.error("Icoon opslaan mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Opslaan is mislukt. Probeer het opnieuw." };
  }
}
