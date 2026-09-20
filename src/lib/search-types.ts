// Typen en grenzen van het zoeken in het beheer; gedeeld door de server-actie (src/app/(beheer)/search.ts) en de zoekbalk.

export type SearchItem = { id: string; title: string; subtitle: string; href: string };
export type SearchGroup = { key: "klanten" | "websites" | "paginas" | "kits"; label: string; icon: string; items: SearchItem[] };
export type SearchResult = { query: string; groups: SearchGroup[] } | { error: string };

/** Zoektermen korter dan dit geven geen resultaten (te breed). */
export const MIN_QUERY = 2;
export const MAX_QUERY = 60;
