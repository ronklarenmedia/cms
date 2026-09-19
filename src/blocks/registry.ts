// Alle beschikbare blocks. Een nieuw block toevoegen = map aanmaken, hier registreren,
// en zijn styles.css importeren in blocks.css. `npm run check:blocks` controleert alle drie.
import type { AnyBlock } from "./contract";
import { ctaBanner } from "./cta-banner";
import { hero } from "./hero";
import { uspGrid } from "./usp-grid";

export const blocks: AnyBlock[] = [hero, uspGrid, ctaBanner];

export const getBlock = (slug: string) => blocks.find((b) => b.slug === slug);
