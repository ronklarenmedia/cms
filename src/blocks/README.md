# Blocks — het contract

Een **block** is een herbruikbare pagina-sectie (hero, USP-grid, FAQ, …). Elke klantsite bouwt zijn pagina's
uit blocks; de builder toont ze in een bibliotheek en genereert het instellingenpaneel uit hun schema.
Alle blocks volgen **hetzelfde stramien**, zodat een nieuw block in een paar bestanden klaar is en
`npm run check:blocks` het automatisch kan controleren.

**Noordster:** supersnelle, goed vindbare websites (ook voor AI-assistenten) — niet visuele originaliteit per
site. Styling loopt dus volledig via de gedeelde thema-tokens; een block bedenkt zelf geen kleuren of maten.

## Hoe een sectie wordt opgeslagen

Een pagina is een lijst secties (JSONB in `pages.content`). Elke sectie:

```json
{
  "id": "sec_01",
  "type": "hero",
  "variant": "split",
  "content": { "heading": "Merkwerk dat blijft staan", "buttons": [{ "label": "Plan een gesprek", "href": "/contact" }] },
  "settings": { "background": "none", "paddingY": "xl", "height": "normal" }
}
```

`BlockRenderer` valideert die met het schema van het block en rendert hem in `<Section>`. Een ongeldige sectie
toont in development een foutmelding en wordt in productie overgeslagen.

## De drie soorten velden

| | Wat | Waar | Voorbeeld |
|---|---|---|---|
| **variant** | Lay-out van hetzelfde block | `variants` in `schema.ts` | `split`, `split-reverse`, `centered` |
| **content** | Wat de redacteur invult | `content`-schema | kop, tekst, `items[]`, afbeelding, knoppen |
| **settings** | Uiterlijk, alleen tokennamen | `settings`-schema | achtergrond, ruimte, uitlijning, zichtbaarheid, kolommen |

- **Eén block, meerdere varianten** — nooit een apart block per lay-out.
- **Content bevat nooit uiterlijk**: geen velden met kleur, achtergrond, padding, klassenamen, lettergrootte (de checker weigert ze).
- **Settings zijn tokennamen of kleine enums**, nooit vrije CSS-waarden of hex-codes.
- Elk block erft de **gedeelde sectie-instellingen** (`sectionSettingsSchema`: `background`, `paddingY`, `maxWidth`, `align`,
  `visibility`, `anchor`) via `sectionSettingsSchema.extend({ … })`. Wrapper, achtergrond en ruimte doet `<Section>`; jouw
  component rendert alleen de inhoud. Een block mag de *standaardwaarde* van een gedeelde instelling overschrijven (zie `cta-banner`).

## Sitebrede blocks (header en footer)

`site-header` en `site-footer` staan niet in een pagina maar op **elke** pagina van de site (`sites.layout`). Welk block in welke plek
mag, staat in `src/app/websites/layout-slots.ts`; zulke blocks verschijnen niet in de bibliotheek voor gewone pagina's en andersom.
De omringende `<header>`, `<main>` en `<footer>` (landmarks) komen van `SiteFrame`, dus zo'n block rendert alleen zijn inhoud.
Een nieuwe header- of footer-lay-out is bij voorkeur een nieuwe *variant* van het bestaande block.

## Mapstructuur

```
src/blocks/<slug>/          slug = kebab-case, gelijk aan de mapnaam
  schema.ts       Zod-schema: varianten, content, settings + types
  Component.tsx   server component; alleen semantische HTML
  fixtures.ts     voorbeelddata: minstens één per variant, plus een minimale
  styles.css      alleen tokens; klassen beginnen met blk-<slug>
  index.ts        defineBlock({ slug, label, description, category, icon, status, … })
src/blocks/registry.ts      registreer het block
src/blocks/blocks.css       voeg één @import "./<slug>/styles.css"; toe
```

**Referentie-blocks — kopieer er één als startpunt:**

| Block | Leert je |
|---|---|
| `hero/` | varianten, optionele velden, afbeelding, knoppen, block-specifieke instelling (`height`) |
| `usp-grid/` | herhaalde items (`items[]`), kolomkeuze (`columns`), kopniveau dat meebeweegt |
| `cta-banner/` | simpel block; eigen standaardachtergrond; verplichte knop |

## Regels

### CSS en thema
1. **Alleen `var(--var-*)`-tokens** voor kleur, ruimte, lettertype, rand, schaduw, breedte, overgang. De volledige set staat in
   `theme.ts` (87 tokens; toelichting in `.claude/skills/theme-field-schema/SKILL.md`). Een verzonnen token wordt afgekeurd.
2. **Geen** hex/rgb/hsl/kleurnamen, **geen** `!important`, **geen** inline `style`, **geen** `<style>`-element, geen `@media`.
   `color-mix()` en `currentColor` mogen.
3. **Lokale variabelen** heten `--blk-*`. De sectie levert er al: `--blk-fg`, `--blk-muted`, `--blk-line`, `--blk-tint`,
   `--blk-accent`, `--blk-btn-bg`, `--blk-btn-fg`. Gebruik die in plaats van kleuren te kiezen; ze passen zich aan op donkere achtergronden.
4. **Responsief met `@container blk (min-width: …)`**, niet met `@media`, zodat het builder-canvas (390 / 760 px) klopt.
   Breekpunten: mobiel < 40rem, tablet 40–64rem, desktop ≥ 64rem. Werk mobile-first.
5. **Klassen** beginnen met `blk-<slug>` (BEM: `blk-hero__heading`, `blk-hero--split`). Gedeeld en toegestaan: `blk-btns`, `blk-btn*`.
6. **Specificiteit:** de gedeelde basisregels (`:where(.blk) p`, `a`, `ul`, `img`, koppen) hebben specificiteit 0, dus jouw klasse wint altijd.
   Schrijf daarom `.blk-x__body { margin-top: … }` en geen `.blk-x p { … }`.
7. **Maten:** rem of tokens, geen losse px (behalve 1px hairlines; de checker waarschuwt).

### HTML, toegankelijkheid en vindbaarheid
8. **Semantische HTML**: `<ul>/<li>` voor lijsten, `<figure>`, `<details>` voor uitklappen, `<a>` voor links, `<button>` alleen voor acties.
9. **Kopniveaus:** alleen de hero heeft een `<h1>`. Andere blocks beginnen bij `<h2>`, items daaronder `<h3>`. Heeft een block geen eigen `<h2>`,
   dan zijn de items `<h2>` (zie `usp-grid`). Nooit een niveau overslaan.
10. **Afbeeldingen** via `<Img>` (`parts/Img.tsx`), nooit een kale `<img>`. `alt` is verplicht; alleen echt decoratieve beelden krijgen
    `decorative: true`. Geef `width`/`height` op tegen layoutverschuiving. `priority` alleen voor het beeld boven de vouw.
11. **Tekst is DOM-tekst**, nooit tekst in een afbeelding; zoekmachines en AI lezen de HTML.
12. **Gestructureerde data** waar het bestaat: FAQ → `FAQPage`, reviews → `Review`/`AggregateRating`, team → `Person`. Gebruik `<JsonLd>`
    (`parts/JsonLd.tsx`); dat is de enige plek waar `dangerouslySetInnerHTML` mag.
13. **Knoppen** via `<Buttons>` (`parts/Buttons.tsx`); vuistregel: maximaal één `primary` per sectie.

### Snelheid
14. **Server components, geen client-JS.** Geen `"use client"`, geen `next/*`-imports (blocks blijven framework-onafhankelijk),
    geen eigen fonts of externe scripts. Uitklappen kan met `<details>`. Heeft een block echt interactiviteit nodig (slider, tabs,
    winkelwagen)? Overleg eerst; de checker weigert `"use client"`.
15. Minder is meer: een block levert alleen de CSS die het gebruikt, in zijn eigen `styles.css`.

### Fixtures
16. Minstens **één fixture per variant**, en één **minimale** (alleen verplichte velden) zodat de lege staat getest wordt.
    Realistische Nederlandse voorbeeldtekst; afbeeldingen uit `public/blocks/`.
17. Fixtures worden gebruikt door de showcase (`/componenten/showcase`) én door de checker — schrijf ze als echte, geldige data.

## Een nieuw block toevoegen

1. Kopieer een referentie-map naar `src/blocks/<slug>/` en pas `schema.ts` aan (varianten, content, settings).
2. Schrijf `Component.tsx` (alleen inhoud; de wrapper komt van `<Section>`).
3. Schrijf `fixtures.ts`, dan `styles.css` (prefix `blk-<slug>`).
4. Vul `index.ts` in met `defineBlock({ … })`. `category` is een van: Navigatie, Hero's, Content, Media, Formulieren, Commerce, Vertrouwen, Afsluiters.
   `status`: `beta` voor nieuw werk, `kit-ready` als het getest is in beide voorbeeldthema's.
5. Registreer in `registry.ts` (import + in de array) en voeg `@import "./<slug>/styles.css";` toe aan `blocks.css`.
6. Draai **`npm run check:blocks`** tot het groen is; bekijk daarna `/componenten/showcase` in beide thema's en op mobiel.

## De checker

`npm run check:blocks` valideert per block: metadata, verplichte bestanden, registratie en `@import`, dat elke variant een fixture heeft,
dat elke fixture het schema haalt, en de gerenderde HTML (geen inline styles/scripts, `alt` aanwezig, links met `href`, kopniveaus, class-prefix).
Daarnaast scant hij alle bron- en CSS-bestanden op kleurcodes, onbekende tokens, `!important`, `@media`, `"use client"` en selectors buiten
het block. Exit code 1 bij een fout; de melding zegt welk block, welke fixture en wat er mis is.

## Niet aanpassen zonder overleg

`contract.ts`, `theme.ts`, `Section.tsx`, `BlockRenderer.tsx`, `blocks.css` (behalve je eigen `@import`), `parts/*`, `scripts/check-blocks.ts` en
andermans blocks. Mis je een gedeelde bouwsteen (bijv. een nieuw veldtype of onderdeel)? Beschrijf wat je nodig hebt in plaats van het zelf te wijzigen.
