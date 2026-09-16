# Project-status

_Laatst bijgewerkt: 2026-09-16. Bedoeld als startpunt voor een nieuwe sessie/context window — lees dit eerst._

## Wat dit is

Monorepo (`apps/cms` = Payload CMS 3.89 op Postgres/Neon, `apps/site` = Astro-frontend) voor een multi-tenant CMS-platform: één CMS beheert meerdere klantsites (`sites`-collection).

**Noordster:** supersnelle, AI/LLM-search-geoptimiseerde websites bouwen — niet bespoke design per site. Originaliteit is expliciet ondergeschikt aan snelheid en doorzoekbaarheid. Zie `.claude/skills/theme-field-schema/SKILL.md` (bovenaan: "Filosofie").

## Architectuur in het kort

- **CMS** (`apps/cms`): Next.js + Payload, Postgres via Neon (cloud, niet lokaal — zie `apps/cms/.env`).
- **Site** (`apps/site`): Astro, momenteel nog grotendeels een stub (zie "Bekende gaten" hieronder).
- **Dev-server starten:** `.claude/launch.json` bevat configs `cms` (poort 3000) en `site` (poort 4321) — via `preview_start` (Claude Browser-tool) of `pnpm dev:cms`/`pnpm dev:site` vanaf de repo-root.
- **Belangrijk bij schemawijzigingen:** Payload's Postgres-adapter gebruikt drizzle-kit "push" in dev-mode. Bij hernoemde/verwijderde kolommen kan dit een **interactieve prompt** in de terminal geven ("is dit een nieuwe kolom of een hernoeming?") die een achtergrond-dev-server niet kan beantwoorden — de server lijkt dan vast te lopen (requests duren minuten). Fix: kolommen die niet meer bestaan handmatig droppen via een node/pg-scriptje vóór het herstarten (zie git-geschiedenis van deze sessie voor het patroon), of het zelf interactief in een eigen terminal oplossen.

## Wat er nu staat (chronologisch, laatste 3 commits)

### 1. `d338d9d` — Sites: tabs Algemeen/Thema/Facturatie/Vercel
Basis tabs-structuur op de `Sites`-collection (`apps/cms/src/collections/Sites.ts`), gemaakt op een ander device, hierheen gepulld.

### 2. `23fd679` — Site-instellingen + CSS-thema-skill
- **Instellingen-tab** op Sites: Algemeen (siteName/favicon/locale), SEO (metaTitle/metaDescription/ogImage), Analytics (gaId/headScripts) — `apps/cms/src/collections/fields/settingsFields.ts`.
- **CSS-thema-skill** (`.claude/skills/theme-field-schema/SKILL.md`): vastlegging van een door de gebruiker aangeleverd CSS-conventiedocument. Bevat (A) welke CSS-eigenschappen per HTML-elementgroep primair/zichtbaar vs. secundair/"Geavanceerd" horen te zijn, (B) welke elementen nooit een CMS-veld krijgen (alleen basis-CSS of een `customCss`-veld), (C) de volledige variabelen-taxonomie, (D) Payload-veldtype-mapping. **Lees dit bestand voor je een nieuw block bouwt.**
- **Thema-tab herbouwd**: `apps/cms/src/collections/fields/themeFields.ts` — 87 design-tokens in 6 subtabjes (Typografie/Kleuren/Vormgeving & Randen/Ruimte & Afmetingen/Media & Objecten/Interactie-Status & Lagen). Veldnamen zijn camelCase-versies van de CSS-varnaam (`--var-font-size-xs` → `fontSizeXs`). Gebruikt in `Sites.theme`, `SiteTemplates.theme`, `Pages.themeOverrides`.
- **Presets**: hergebruikt de bestaande `site-templates`-collection als opslag. `apps/cms/src/components/ThemePresets.tsx` = custom admin-UI (dropdown "Preset laden" + naamveld "Opslaan als nieuwe preset") bovenaan de Thema-tab, leest/schrijft de live Payload-formulierstatus (`useAllFormFields`/`dispatchFields`) — werkt dus ook vóór opslaan. **6 presets al aangemaakt in de database:** Corporate Tech, Wellness & Spa, Kids & Play, Neon Synthwave, High Fashion Editorial, Retro 70s Vintage (via Gemini gegenereerd, gevalideerd tegen het 87-veldenschema, weggeschreven via een eenmalig `payload run`-seedscript — zie `.claude/skills/theme-field-schema/example-preset.json` voor het doelformaat als er meer bijkomen).
- **Live thema-preview**: `apps/cms/src/components/ThemePreview.tsx`, direct onder de presetknoppen — toont een mini-kaartje (swatches, titel, knoppen, badges) opgebouwd met dezelfde `--var-*`-CSS-vars, reageert live op elke wijziging. **Let op: dit is een preview van het thema (kleuren/fonts/enz.), niet van een echte pagina** — dat laatste is de openstaande "preview-optie"-vraag van de gebruiker, nog niet gebouwd.
- `apps/site/src/lib/theme.ts` herbouwd: `themeToCssVars()` zet elk theme-veld mechanisch om naar `--var-{kebab-case}`. **Nog nergens aangeroepen** vanuit een `.astro`-bestand — geen layout leest de site-instellingen nog uit.

### 3. `5d4c717` — Blocks-herbouw
- **Conflict opgelost**: `HeroBlock.ts` + `Hero_1.astro` (ongebruikte WIP, botste met `hero.ts` op slug `"hero"`) verwijderd. `hero.ts` blijft het ene Hero-blok (heeft al 2 echte testdata-rijen).
- **CSS-vars gefixt**: `Hero.astro`/`Section.astro` gebruikten nog oude, niet-geprefixte namen (`--color-primary`, `--page-max-width`) — omgezet naar `--var-*`. Let op: dit was een gerichte fix van bestaande `var()`-verwijzingen, geen volledige tokenisatie van alle hardcoded waarden in die bestanden.
- **Taxonomie gevalideerd**: gebruiker leverde een CSV (1940 rijen, get.section.express screenshots, 26 categorieën) als inspiratie — bevestigde en verfijnde het bestaande blokkenplan uit code-comments ("doc §7", een extern, niet-ingecheckt architectuurdocument).
- **6 nieuwe blocks gebouwd** (`apps/cms/src/blocks/`): `sectionHeading` (intro-kop, ontbrak nog in doc §7), `uspGrid` (icoon/titel/tekst-grid, 2-4 kolommen), `stats` (losse statistieken-rij), `ctaBanner` (solid/soft), `testimonials` (grid/single), `logoBar`. Alle 6 hebben **alleen inhoudsvelden, geen kleurkiezers** — styling komt automatisch uit de theme-tokens.
- **Astro-renderers**: alleen voor `UspGrid` en `CtaBanner` gebouwd (`apps/site/src/components/blocks/`). De rest heeft nog geen renderer.

## Hoe je een preset toevoegt (Gemini of anders)

1. Genereer JSON conform `.claude/skills/theme-field-schema/example-preset.json` (exact 87 keys + `name`, geen extra/ontbrekende sleutels, `opacity*`/`zIndex*` als getal, de rest als string).
2. Plak de JSON in de chat, of vraag om validatie + wegschrijven via een `payload run`-scriptje (zie git-geschiedenis voor het exacte patroon — laadt `.env` handmatig, want `payload run` doet dat niet automatisch).

## Bekende gaten / bewust uitgesteld

- **`apps/site` is grotendeels een stub**: 1 placeholder-pagina (`index.astro`), niet gekoppeld aan Payload's API. `getPageBySlug`/`getSite` bestaan als functies in `apps/site/src/lib/payload-client.ts` maar worden nergens aangeroepen.
- **Geen page-preview**: gebruiker wil een manier om een pagina (met zijn blocks) te kunnen bekijken — nog niet gebouwd. Kandidaat-aanpakken: Payload's ingebouwde `admin.livePreview`-config (iframe naar de Astro-site), of een simpelere read-only render-preview binnen de CMS zelf. Vereist waarschijnlijk eerst dat `apps/site` daadwerkelijk pagina's rendert vanuit Payload's data.
- **SEO/AI-search-laag nog niet aangesloten**: metaTitle/metaDescription/ogImage-velden bestaan (Instellingen-tab), maar geen enkele `.astro`-layout leest ze uit. Geen JSON-LD, geen `llms.txt`, geen sitemap.
- **Thema-tab UI is kaal**: alle 87 velden zijn plain `text`/`number`, geen colorpicker of font-dropdown — bewust, zie skill-bestand sectie D. Polish is toekomstig werk.
- **10+ blocks nog te bouwen** (uit de CSV-taxonomie, grofweg op populariteit): Contact (101 voorbeelden — grootste gat), Prijstabel + Price-list, FAQ, Galerij, Team-grid, Tijdlijn, Video, Nieuwsbrief, Divider, Aankondigingsbalk, Social-feed.
- **4 blocks hebben nog geen Astro-renderer**: `sectionHeading`, `stats`, `testimonials`, `logoBar` (Payload-config bestaat al, frontend-render nog niet).

## Conventies om aan te houden

- Nieuwe blocks: content-only velden, geen per-block kleurkiezers — styling via `--var-*`-tokens met CSS-fallbackwaarden (zie `UspGrid.astro`/`CtaBanner.astro` als voorbeeld).
- Varianten zijn een select/radio-veld op één bloktype, geen apart component per variant (doc §7-principe, al toegepast in `hero.ts`, `fotoTekst.ts`, `uspGrid.ts`, `ctaBanner.ts`).
- Na elke Payload-veldwijziging: `pnpm run generate:types` in `apps/cms`, en check `pnpm exec tsc --noEmit` in zowel `apps/cms` als `apps/site`.
- Custom admin-componenten (zoals `ThemePresets`/`ThemePreview`) registreren als `type: "ui"`-veld met `admin.components.Field: "/src/components/X#X"` — importMap.js wordt door de dev-server meestal automatisch bijgewerkt.
