import type { Block } from "payload";
import { Hero } from "./hero";
import { FotoTekst } from "./fotoTekst";

// Startset uit doc §7. De overige v1-blokken (Dubbele foto, Galerij, Video,
// Tekstblok, USP-grid, Testimonials, Statistieken, Logo's-balk, Prijstabel,
// FAQ, Team-grid, Tijdlijn, CTA-banner, Contactblok, Nieuwsbrief, Divider,
// Aankondigingsbalk, Social-feed) volgen in dezelfde vorm als deze twee.
export const blocks: Block[] = [Hero, FotoTekst];
