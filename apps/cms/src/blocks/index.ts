import type { Block } from "payload";
import { Hero } from "./hero";
import { FotoTekst } from "./fotoTekst";
import { SectionHeading } from "./sectionHeading";
import { UspGrid } from "./uspGrid";
import { Stats } from "./stats";
import { CtaBanner } from "./ctaBanner";
import { Testimonials } from "./testimonials";
import { LogoBar } from "./logoBar";

// Startset uit doc §7, gevalideerd tegen de section.express-taxonomie
// (26 categorieën, zie CSV-analyse). Resterende v1-blokken (Galerij, Video,
// Tekstblok, Prijstabel, FAQ, Team-grid, Tijdlijn, Contactblok, Nieuwsbrief,
// Divider, Aankondigingsbalk, Social-feed) volgen in dezelfde vorm.
export const blocks: Block[] = [Hero, FotoTekst, SectionHeading, UspGrid, Stats, CtaBanner, Testimonials, LogoBar];
