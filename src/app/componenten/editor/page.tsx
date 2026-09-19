import { connection } from "next/server";
import { blocks, getBlock } from "@/blocks/registry";
import { blockTokens, blockUsage } from "../data";
import { ComponentWorkbench } from "./ComponentWorkbench";

export default async function ComponentEditorPage({ searchParams }: { searchParams: Promise<{ block?: string }> }) {
  await connection(); // gebruik per site komt uit de database
  const { block } = await searchParams;
  const initial = (block && getBlock(block)) || blocks[0];
  const [usage, tokens] = await Promise.all([blockUsage(), blockTokens()]);
  // key: bij een andere ?block= (bijv. via het overzicht) opnieuw beginnen met dat component.
  return <ComponentWorkbench key={initial.slug} initialSlug={initial.slug} usage={usage} tokens={tokens} />;
}
