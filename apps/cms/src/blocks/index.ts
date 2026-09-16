import type { Block } from "payload";
import { Hero } from "./hero";
import { FotoTekst } from "./fotoTekst";
import { SectionHeading } from "./sectionHeading";
import { UspGrid } from "./uspGrid";
import { Stats } from "./stats";
import { CtaBanner } from "./ctaBanner";
import { Testimonials } from "./testimonials";
import { LogoBar } from "./logoBar";
import { Contact } from "./contact";
import { StepBox } from "./stepBox";
import { TeamGrid } from "./teamGrid";
import { PricingTable } from "./pricingTable";
import { Gallery } from "./gallery";
import { Faq } from "./faq";
import { List } from "./list";
import { RichText } from "./richText";
import { Video } from "./video";
import { EmailOptin } from "./emailOptin";
import { PriceList } from "./priceList";
import { Timeline } from "./timeline";
import { Social } from "./social";

// Startset uit doc §7, gevalideerd tegen de section.express-taxonomie
// (26 categorieën, zie CSV-analyse). Aangevuld op 2026-09-17 met de rest van
// de CSV-categorieën (contact, step-box, team-grid, pricing-table, gallery,
// faq, list, richText (content+text-box), video, email-optin, price-list,
// timeline, social). Nog open: Divider, Aankondigingsbalk, Working-hours
// (niche/geen CSV-categorie of te klein om nu te bouwen).
export const blocks: Block[] = [
  Hero,
  FotoTekst,
  SectionHeading,
  UspGrid,
  Stats,
  CtaBanner,
  Testimonials,
  LogoBar,
  Contact,
  StepBox,
  TeamGrid,
  PricingTable,
  Gallery,
  Faq,
  List,
  RichText,
  Video,
  EmailOptin,
  PriceList,
  Timeline,
  Social,
];
