// Alle beschikbare blocks. Een nieuw block toevoegen = map aanmaken, hier registreren,
// en zijn styles.css importeren in blocks.css. `npm run check:blocks` controleert alle drie.
import type { AnyBlock } from "./contract";
import { ctaBanner } from "./cta-banner";
import { faq } from "./faq";
import { hero } from "./hero";
import { logoBar } from "./logo-bar";
import { pricing } from "./pricing";
import { process as processBlock } from "./process";
import { sectionHeading } from "./section-heading";
import { siteFooter } from "./site-footer";
import { siteHeader } from "./site-header";
import { stats } from "./stats";
import { team } from "./team";
import { testimonials } from "./testimonials";
import { textImage } from "./text-image";
import { uspGrid } from "./usp-grid";

export const blocks: AnyBlock[] = [
  hero,
  sectionHeading,
  stats,
  logoBar,
  testimonials,
  textImage,
  uspGrid,
  ctaBanner,
  faq,
  pricing,
  processBlock,
  team,
  siteHeader,
  siteFooter,
];

export const getBlock = (slug: string) => blocks.find((b) => b.slug === slug);
