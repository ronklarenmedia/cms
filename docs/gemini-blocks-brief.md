# Brief voor Gemini — blocks bouwen

Kopieer alles hieronder in het gesprek met Gemini. Geef haar ook toegang tot de repo (of plak `src/blocks/README.md`
en de mappen `hero/`, `usp-grid/`, `cta-banner/`).

---

Je bouwt **blocks** voor een multi-tenant websitebouwer (Next.js + TypeScript + Zod). Een block is een herbruikbare pagina-sectie
zoals een FAQ of teamraster. Alle blocks volgen exact hetzelfde stramien en worden automatisch gecontroleerd.

**Doel van het product:** supersnelle, goed doorzoekbare websites (ook voor AI-assistenten). Geen visuele originaliteit per site:
styling komt volledig uit gedeelde thema-tokens (`--var-*`). Jij verzint dus geen kleuren, lettergroottes of ruimtes.

## Zo werk je

1. **Lees eerst** `src/blocks/README.md` — dat is het contract met alle regels.
2. **Bestudeer de drie referentie-blocks** in `src/blocks/`: `hero/` (varianten, afbeelding, knoppen), `usp-grid/` (herhaalde items, kolomkeuze),
   `cta-banner/` (simpel, eigen standaardachtergrond). Kopieer de map die het best lijkt op wat je bouwt.
3. Bouw per block precies deze vijf bestanden: `schema.ts`, `Component.tsx`, `fixtures.ts`, `styles.css`, `index.ts`.
4. Registreer het block: één import + één regel in `src/blocks/registry.ts` en één `@import` in `src/blocks/blocks.css`.
5. **Draai `npm run check:blocks`** en herhaal tot er `0 fouten` staat. Lees de foutmeldingen: ze noemen het block, de fixture en wat er mis is.
   Kun je geen commando's draaien? Lever dan de bestanden op; de eigenaar draait de check en plakt de uitvoer terug.
6. Bekijk het resultaat op `/componenten/showcase` (thema Corporate én Warm, breedte Desktop én Mobiel) als je de app kunt starten.

## De vaste regels in het kort (volledig: README)

- **Eén block, meerdere varianten** (`variant`-veld = lay-out). Nooit een apart block per lay-out.
- **Content** = wat de redacteur invult (kop, tekst, `items[]`, afbeelding met `alt`, knoppen). **Nooit** kleur-, maat- of klasse-velden.
- **Settings** = uiterlijk als kleine enum of tokennaam. Erf de gedeelde sectie-instellingen via `sectionSettingsSchema.extend({ … })`.
- **CSS:** alleen `var(--var-*)`-tokens en `--blk-*`-variabelen. Geen hex/rgb/kleurnamen, geen `!important`, geen inline `style`, geen `@media`.
  Responsief met `@container blk (min-width: 40rem)` en `64rem`. Klassen beginnen met `blk-<slug>`.
- **HTML:** semantisch; alleen de hero heeft een `<h1>`, andere blocks beginnen bij `<h2>`; nooit een kopniveau overslaan.
  Afbeeldingen via `<Img>` met verplichte `alt`; knoppen via `<Buttons>`; FAQ/reviews/team krijgen JSON-LD via `<JsonLd>`.
- **Geen client-JS:** geen `"use client"`, geen `next/*`-imports, geen externe scripts of fonts. Uitklappen doe je met `<details>`.
- **Fixtures:** minstens één per variant, plus één minimale (alleen verplichte velden). Realistische Nederlandse tekst.

## Wat je NIET aanpast

`contract.ts`, `theme.ts`, `Section.tsx`, `BlockRenderer.tsx`, `parts/*`, `scripts/check-blocks.ts`, `blocks.css` (behalve je eigen `@import`)
en andermans blocks. Mis je een gedeelde bouwsteen of past iets niet in het contract? **Stop en beschrijf** wat je nodig hebt en waarom,
in plaats van het contract of de checker aan te passen om je block door te krijgen.

## Wat je bouwt (batch 1 — begin hier, 4 à 5 blocks per keer)

| slug | categorie | idee voor varianten |
|---|---|---|
| `section-heading` | Content | gecentreerd / links; eyebrow, kop, intro |
| `stats` | Content | rij van kengetallen (`value`, `label`); 3–4 items |
| `logo-bar` | Vertrouwen | logo's met `alt`; grijs of in kleur; ook voor certificeringen |
| `testimonials` | Vertrouwen | grid / enkele grote quote; `Review`-JSON-LD |
| `text-image` | Content | tekst + beeld: beeld links / rechts (vergelijk `fotoTekst` in de oude code) |

**Batch 2:** `faq` (`<details>` + `FAQPage`-JSON-LD), `team-grid`, `pricing-table`, `steps`, `timeline`, `cases-grid`, `gallery`.
**Batch 3:** `footer-compact`, `footer-extended`, `breadcrumbs`, `video`, `list`.

**Nog niet — eerst overleggen** (vereisen client-JS of een backend): topbar met dropdown, mega-menu, mobiel menu, hero-slider, beeldcarrousel,
reviewslider, tabs, winkelwagen-drawer, checkout-stap, meerstaps aanvraag, zoeken met filters, cookiemelding, contactformulier, nieuwsbriefblok.

**Inspiratie voor velden:** je oude Payload-definities staan in git: `git show eab660a:apps/cms/src/blocks/<naam>.ts`
(bijv. `faq.ts`, `teamGrid.ts`, `pricingTable.ts`, `stepBox.ts`, `timeline.ts`). Neem de *velden en varianten* over, niet de Payload-syntax.

## Oplevering per batch

1. De nieuwe mappen + de wijzigingen in `registry.ts` en `blocks.css`.
2. De uitvoer van `npm run check:blocks` (moet `0 fouten` tonen).
3. Een korte lijst: welke blocks, welke varianten, en alles wat je twijfelachtig vond of wat het contract niet dekte.
