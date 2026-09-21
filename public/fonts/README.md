# Lettertypes voor klantsites

Zelf gehoste webfonts voor de design kits (`src/lib/fonts.ts`). Ze staan in `public/fonts/v1/` en worden op elk domein van een
klantsite geserveerd zonder tussenkomst van de proxy (paden met een punt omzeilen `src/proxy.ts`), met een jaar cache
(`next.config.ts`). Geen verbinding met een lettertype-dienst van derden.

- Bron: [Fontsource](https://fontsource.org) 5.3.0 (`@fontsource-variable/*`, en `@fontsource/dm-serif-display` voor de niet-variabele).
- Licentie: alle 14 zijn SIL Open Font License 1.1 (`licenses/<naam>.txt`); vrij te gebruiken en te herdistribueren, ook commercieel.
- Alleen het **Latijnse** subset (dekt het Nederlands en alle West-Europese talen), alleen **rechtopstaand** (geen cursief) en, bij variabele
  lettertypes, alle gewichten in één bestand. Tekens buiten het subset vallen terug op het systeemlettertype.
- Een bestand vervangen? Geef de map een nieuw versienummer (`v2`) en pas `FONT_DIR` in `src/lib/fonts.ts` aan: de bestanden zijn `immutable` gecachet.

## Een lettertype toevoegen

1. Kies er een uit Fontsource met een OFL/Apache-licentie; installeer het pakket tijdelijk buiten dit project (`npm i @fontsource-variable/<naam>`).
2. Kopieer `files/<naam>-latin-wght-normal.woff2` (of `<naam>-latin-400-normal.woff2` voor een niet-variabel lettertype) en `LICENSE` naar deze map (`v1/` en `licenses/`).
3. Voeg het toe aan `CATALOGUE` in `src/lib/fonts.ts` (naam, categorie, bestand, gewichtsbereik).
