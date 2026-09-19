import { readFile } from "node:fs/promises";
import path from "node:path";
import { blocks } from "@/blocks/registry";
import { db } from "@/db";
import { pages } from "@/db/schema";

/** Aantal sites waarin elk block (slug) minstens één keer is gebruikt. */
export async function blockUsage(): Promise<Record<string, number>> {
  const rows = await db.select({ siteId: pages.siteId, content: pages.content }).from(pages);
  const sitesPerBlock = new Map<string, Set<string>>();
  for (const row of rows) {
    for (const section of row.content) {
      const set = sitesPerBlock.get(section.type) ?? new Set<string>();
      set.add(row.siteId);
      sitesPerBlock.set(section.type, set);
    }
  }
  return Object.fromEntries([...sitesPerBlock].map(([slug, set]) => [slug, set.size]));
}

const TOKEN = /var\(\s*(--var-[a-z0-9-]+)/g;

/** De `--var-*`-tokens die de styles.css van elk block gebruikt (gesorteerd, uniek). */
export async function blockTokens(): Promise<Record<string, string[]>> {
  const entries = await Promise.all(
    blocks.map(async (b) => {
      // b.slug komt uit het register (kebab-case), niet uit gebruikersinvoer.
      const file = path.join(process.cwd(), "src", "blocks", b.slug, "styles.css");
      const css = await readFile(file, "utf8").catch(() => "");
      const tokens = [...new Set([...css.matchAll(TOKEN)].map((m) => m[1]))].sort();
      return [b.slug, tokens] as const;
    }),
  );
  return Object.fromEntries(entries);
}
