import { sql } from "drizzle-orm";
import { db } from "@/db";

export type DatabaseHealth = { ok: true; ms: number; region: string | null } | { ok: false };

/** Regio van een Neon-verbinding (bijv. eu-central-1) uit de hostnaam; nooit de hostnaam of inloggegevens zelf. */
function neonRegion(url: string | undefined): string | null {
  return url?.match(/\.([a-z]{2}-[a-z]+-\d)\.(?:aws|azure)\.neon\.tech/)?.[1] ?? null;
}

/** Een echte controle: één lichte query, met de tijd die het antwoord kostte. */
export async function checkDatabase(): Promise<DatabaseHealth> {
  const started = performance.now();
  try {
    await db.execute(sql`select 1`);
    return { ok: true, ms: Math.round(performance.now() - started), region: neonRegion(process.env.DATABASE_URL) };
  } catch {
    return { ok: false };
  }
}
