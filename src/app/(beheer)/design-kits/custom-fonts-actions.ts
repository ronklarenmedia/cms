"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { hostedFonts, type HostedFont } from "@/db/schema";
import { CustomFontError, storeCustomFontFile } from "@/lib/custom-fonts";
import { FONT_WEIGHTS } from "@/lib/custom-fonts-index";
import { NOT_LOGGED_IN, staffUser } from "@/lib/session";

// Server-actie voor het uploaden van een eigen lettertype (naast op-verzoek gehoste Google Fonts, zie
// google-fonts-actions.ts). Beide landen in dezelfde platformbrede `hosted_fonts`-tabel.

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const CATEGORY = ["sans", "serif", "mono", "display", "handwriting"] as const;
// Geen komma's of symbolen die een CSS font-family-lijst zouden kunnen breken; wel accenten, spaties, punten en streepjes.
const familySchema = z
  .string()
  .trim()
  .min(1, "Geef een naam voor het lettertype op.")
  .max(80)
  .regex(/^[\p{L}\p{N} .'-]+$/u, "Alleen letters, cijfers, spaties, punten, apostrofs en streepjes.");

async function findByFamily(family: string): Promise<HostedFont | undefined> {
  const [row] = await db
    .select()
    .from(hostedFonts)
    .where(sql`lower(${hostedFonts.family}) = lower(${family})`);
  return row;
}

/**
 * Voegt een eigen .woff2-bestand toe aan een lettertypefamilie: nieuw, of een extra gewicht bij een familie die al
 * gehost wordt (ook eentje die eerder on-demand van Google kwam — dat wordt dan aangevuld, niet vervangen).
 */
export async function uploadCustomFont(formData: FormData): Promise<Result<{ font: HostedFont }>> {
  const user = await staffUser();
  if (!user) return { ok: false, error: NOT_LOGGED_IN };

  const family = familySchema.safeParse(formData.get("family"));
  if (!family.success) return { ok: false, error: family.error.issues[0]?.message ?? "Ongeldige naam." };
  const weight = z.enum(FONT_WEIGHTS).safeParse(formData.get("weight"));
  if (!weight.success) return { ok: false, error: "Kies een geldig gewicht." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Kies een .woff2-bestand om te uploaden." };

  const existing = await findByFamily(family.data);

  // Alleen nodig bij een nieuwe familie; een bestaande familie (ook eentje die van Google kwam) houdt haar eigen categorie aan.
  let category: (typeof CATEGORY)[number];
  if (existing) {
    category = existing.category;
  } else {
    const parsed = z.enum(CATEGORY).safeParse(formData.get("category"));
    if (!parsed.success) return { ok: false, error: "Kies een categorie." };
    category = parsed.data;
  }

  let stored;
  try {
    stored = await storeCustomFontFile(existing?.id ?? null, weight.data, Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    if (e instanceof CustomFontError) return { ok: false, error: e.message };
    console.error("Eigen lettertype uploaden mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Uploaden is mislukt. Probeer het opnieuw." };
  }

  const files = [...(existing?.files.filter((f) => f.weight !== weight.data) ?? []), { weight: weight.data, url: stored.path }];

  try {
    if (existing) {
      const [row] = await db.update(hostedFonts).set({ files }).where(eq(hostedFonts.id, existing.id)).returning();
      return { ok: true, font: row };
    }
    const [row] = await db
      .insert(hostedFonts)
      .values({ id: stored.id, family: family.data, category, files, createdBy: user.id })
      .returning();
    return { ok: true, font: row };
  } catch (e) {
    console.error("Eigen lettertype opslaan mislukt:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Opslaan is mislukt. Probeer het opnieuw." };
  }
}
