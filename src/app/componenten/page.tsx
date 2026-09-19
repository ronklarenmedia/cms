import { blocks } from "@/blocks/registry";
import { ComponentsOverview, type BlockFacts } from "./ComponentsOverview";
import { blockTokens, blockUsage } from "./data";
import { requireStaff } from "@/lib/session";

export default async function ComponentenPage() {
  await requireStaff(); // controle op de sessie; maakt de pagina ook dynamisch (live database-data)
  const [usage, tokens] = await Promise.all([blockUsage(), blockTokens()]);
  const facts: Record<string, BlockFacts> = Object.fromEntries(
    blocks.map((b) => [b.slug, { sites: usage[b.slug] ?? 0, tokens: tokens[b.slug]?.length ?? 0 }]),
  );
  return <ComponentsOverview facts={facts} />;
}
