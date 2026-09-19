import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { DEFAULT_SETTINGS, type PlatformSettings } from "./platform-settings-schema";

// Leest de platforminstellingen uit de database (alleen op de server; types en validatie staan in
// ./platform-settings-schema.ts).

const fromRow = (row: typeof platformSettings.$inferSelect): PlatformSettings => ({
  platformName: row.platformName,
  adminDomain: row.adminDomain ?? "",
  language: row.language,
  timezone: row.timezone,
  supportEmail: row.supportEmail ?? "",
  senderName: row.senderName ?? "",
  phone: row.phone ?? "",
  kvk: row.kvk ?? "",
});

/** De huidige instellingen; per request maar één keer opgehaald. Valt terug op de standaardwaarden. */
export const getPlatformSettings = cache(async (): Promise<PlatformSettings> => {
  try {
    const [row] = await db.select().from(platformSettings).where(eq(platformSettings.id, 1));
    return row ? fromRow(row) : DEFAULT_SETTINGS;
  } catch (e) {
    // Bijv. de tabel bestaat nog niet in deze omgeving; de rest van het platform moet gewoon werken.
    console.error("Platforminstellingen konden niet worden gelezen:", e instanceof Error ? e.message : e);
    return DEFAULT_SETTINGS;
  }
});
