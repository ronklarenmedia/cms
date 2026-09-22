"use server";

import { asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { hostedFonts, type HostedFont } from "@/db/schema";
import { fetchAndStoreFont, GoogleFontError } from "@/lib/google-fonts";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";

// Server-acties voor de on-demand Google Fonts-bibliotheek (zie src/lib/google-fonts.ts). De tabel `hosted_fonts` is
// platformbreed (geen site- of klantscope), dus elke medewerker mag hem lezen en aanvullen.

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const isUniqueViolation = (e: unknown): boolean => typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "23505";

async function findByFamily(family: string): Promise<HostedFont | undefined> {
  const [row] = await db
    .select()
    .from(hostedFonts)
    .where(sql`lower(${hostedFonts.family}) = lower(${family})`);
  return row;
}

/** Alle on-demand gehoste Google Fonts, voor de zoek-picker en live voorbeelden. Klein en platformbreed: alles in één keer. */
export async function listHostedFonts(): Promise<HostedFont[]> {
  if (!(await staffUser())) return [];
  return db.select().from(hostedFonts).orderBy(asc(hostedFonts.family));
}

/** Haalt een Google Font op bij Google (als hij nog niet gehost is) en geeft de rij terug. */
export async function fetchGoogleFont(family: string): Promise<Result<{ font: HostedFont }>> {
  const user = await staffUser();
  if (!user) return { ok: false, error: NOT_LOGGED_IN };

  const existing = await findByFamily(family);
  if (existing) return { ok: true, font: existing };

  let stored;
  try {
    stored = await fetchAndStoreFont(family);
  } catch (e) {
    if (e instanceof GoogleFontError) return { ok: false, error: e.message };
    console.error("Google Font ophalen mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Ophalen is mislukt. Probeer het opnieuw." };
  }

  try {
    const [row] = await db
      .insert(hostedFonts)
      .values({ id: stored.id, family: stored.family, category: stored.category, files: stored.files, createdBy: user.id })
      .returning();
    return { ok: true, font: row };
  } catch (e) {
    // Race: een andere medewerker koos dezelfde familie tussen de lees- en schrijfstap.
    if (isUniqueViolation(e)) {
      const race = await findByFamily(family);
      if (race) return { ok: true, font: race };
    }
    console.error("Google Font opslaan mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Opslaan is mislukt. Probeer het opnieuw." };
  }
}
