import { createHash } from "node:crypto";
import type { SiteSnapshot } from "@/db/schema";

// Hulpmiddelen voor momentopnames van een site (zie `site_versions`). Puur; geen database.

/** Sleutels op vaste volgorde, zodat dezelfde inhoud altijd dezelfde tekst (en dus dezelfde hash) geeft. Postgres bewaart jsonb niet in invoervolgorde. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => [k, canonical(v)]),
    );
  }
  return value;
}

/** Vingerafdruk van een momentopname: gelijk als en alleen als de inhoud gelijk is. */
export function hashSnapshot(snapshot: SiteSnapshot): string {
  return createHash("sha256").update(JSON.stringify(canonical(snapshot))).digest("hex");
}
