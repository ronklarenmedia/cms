// Alle beschikbare blocks. Een nieuw block toevoegen = map aanmaken, hier registreren,
// en zijn styles.css importeren in blocks.css. `npm run check:blocks` controleert alle drie.
import type { AnyBlock } from "./contract";
import { breadcrumbs } from "./breadcrumbs";
import { carousel } from "./carousel";
import { cases } from "./cases";
import { comparison } from "./comparison";
import { contact } from "./contact";
import { cookieNotice } from "./cookie-notice";
import { ctaBanner } from "./cta-banner";
import { faq } from "./faq";
import { gallery } from "./gallery";
import { hero } from "./hero";
import { list } from "./list";
import { logoBar } from "./logo-bar";
import { pricing } from "./pricing";
import { process as processBlock } from "./process";
import { sectionHeading } from "./section-heading";
import { siteFooter } from "./site-footer";
import { siteHeader } from "./site-header";
import { stats } from "./stats";
import { tabs } from "./tabs";
import { team } from "./team";
import { testimonials } from "./testimonials";
import { textImage } from "./text-image";
import { timeline } from "./timeline";
import { uspGrid } from "./usp-grid";
import { video } from "./video";

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
  tabs,
  team,
  timeline,
  cases,
  gallery,
  carousel,
  breadcrumbs,
  video,
  list,
  contact,
  comparison,
  cookieNotice,
  siteHeader,
  siteFooter,
];

export const getBlock = (slug: string) => blocks.find((b) => b.slug === slug);
