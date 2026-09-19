import { connection } from "next/server";
import { blocks } from "@/blocks/registry";
import { ComponentsOverview, type BlockFacts } from "./ComponentsOverview";
import { blockTokens, blockUsage } from "./data";

export default async function ComponentenPage() {
  await connection(); // gebruik per site komt uit de database
  const [usage, tokens] = await Promise.all([blockUsage(), blockTokens()]);
  const facts: Record<string, BlockFacts> = Object.fromEntries(
    blocks.map((b) => [b.slug, { sites: usage[b.slug] ?? 0, tokens: tokens[b.slug]?.length ?? 0 }]),
  );
  return <ComponentsOverview facts={facts} />;
}
