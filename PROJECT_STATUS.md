# Project-status

_Laatst bijgewerkt: 2026-09-17 (nacht). Bedoeld als startpunt voor een nieuwe sessie/context window — lees dit eerst._

## Nieuw vannacht: 13 blocks + block-showcase-pagina (2026-09-17)

Opdracht was: "bouw vannacht door aan nieuwe blocks, kies verschillende, let op de opmaak, puur blocks — geen andere code aanpassen." Alle resterende CSV-categorieën gebouwd (Payload-config + Astro-renderer + registratie in `blocks/index.ts` en `BlockRenderer.astro`):
`contact` (3 varianten: formInfo/split/locations), `stepBox` (image/icon/numbered — 125 CSV-voorbeelden, was over het hoofd gezien in het vorige blokkenplan), `teamGrid` (cards/photo), `pricingTable`, `gallery` (grid met per-image "span" voor bento-layout), `faq` (centered/split, native `<details>`, geen JS), `list` (detailed/simple), `richText` (dekt CSV-categorieën "content"+"text-box" samen, zie hieronder), `video` (mp4-upload of externe link), `emailOptin` (centered/split), `priceList` (los van pricingTable — menu-achtige lijst), `timeline` (horizontal/vertical), `social` (bar/iconsRound).

**Bekijk alles in één keer:** pagina-id 2, slug `demo-nieuwe-blocks`, titel "DEMO — nieuwe blocks (mag je verwijderen)" — open `http://localhost:4321/preview/2` (cms + site devservers moeten draaien). Bevat alle 24 block-varianten met testdata. **Gerust verwijderen** als je 'm niet meer nodig hebt (Payload-admin → Pages).

**`richText`-block (nieuw patroon):** eerste block met Payload's `type: "richText"` (lexicalEditor). Astro/Next hebben geen ingebouwde manier om dat naar HTML te renderen zonder de `@payloadcms/richtext-lexical`-dependency in `apps/site` te trekken — in plaats daarvan is er een **kleine, dependency-vrije serializer** geschreven: `apps/site/src/lib/lexical-to-html.ts` (dekt paragraph/heading/list/listitem/quote/link + bold/italic/underline/strikethrough/code). Werkt voor Payload's standaard-toolbar; exotischere lexical-features (tabellen, uploads-in-tekst, custom blocks-in-tekst) worden genegeerd.

**2 echte bugs gevonden en gefixt tijdens het verifiëren** (via een tijdelijke testpagina, zie hierboven):
1. `Contact.astro` (variant `split`) rendereerde de heading dubbel — een generieke intro-`div` én een split-specifieke intro renderden allebei `<h2>{heading}</h2>`. Gefixt: generieke intro toont alleen bij variant `formInfo`.
2. Split-layout-afbeeldingen (`Contact`/`Faq`/`EmailOptin`, variant `split`) hadden geen `aspect-ratio` — een portret-afbeelding (zoals de test-upload, 1228×1737) blies de hele sectie honderden pixels hoger op dan bedoeld. Gefixt met `aspect-ratio` + `object-fit: cover`, zelfde patroon als `TeamGrid`'s foto-variant al gebruikte.

**Kleine, bewust buiten de "puur blocks"-scope gemaakte uitzondering:** `apps/site/src/pages/preview/[id].astro` had nergens een expliciete `body { background; color }` — zonder theme (of met een donker thema) kon de browser een donker canvas forceren terwijl tekst standaard zwart bleef, dus onzichtbaar. Toegevoegd: `body { background: var(--var-color-white, #fff); color: var(--var-color-text, #1e293b); }`. Dit is geen block-bestand, maar zonder deze fix was geen enkel block (oud of nieuw) betrouwbaar zichtbaar in de preview.

**Nog open uit de CSV-taxonomie:** Divider, Aankondigingsbalk (announcement bar), Working-hours (3 voorbeelden, erg niche) — geen van drieën had een eigen CSV-categorie/genoeg voorbeelden om nu te bouwen. `fotoTekst.ts`'s eventuele "full-width-duo"-variant is ook nog niet toegevoegd.

**Server-geheugensteun:** tijdens het bouwen bleek dat een `richText`-veld toevoegen een **volledige herstart + `.next`-cache-clear** van de cms-devserver nodig had (niet alleen een herstart) — Next's RSC-client-manifest kon de nieuwe lexical-editor-featurecomponenten niet hot-reloaden. Als een nieuw veldtype rare "Could not find module ... in the React Client Manifest"-errors geeft: `rm -rf apps/cms/.next` en dan pas herstarten.

## Let op: bekende server-instabiliteit (2026-09-16 avond)

Tijdens deze sessie draaide gelijktijdig een cms-devserver van een ándere
sessie op poort 3000. Die server gaf op een gegeven moment 500 "Something
went wrong" terug op **alle** `/api/pages`-requests (zelfs een simpele
`GET /api/pages` zonder auth), terwijl `/api/sites` wel gewoon werkte. Een
verse cms-instantie (zelfde code, poort 3001) had dit probleem niet — dus dit
is hoogstwaarschijnlijk een gestold/stuk proces van die andere sessie, geen
codefout. **Als `/api/pages` weer 500's geeft: herstart de cms-devserver.**

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

### 4. (ongecommit, deze sessie) — Page-preview

Opgepakt: de "Geen page-preview"-vraag uit "Bekende gaten" hieronder.

- **Alle 8 blocks hebben nu een Astro-renderer**: `FotoTekst`, `SectionHeading`, `Stats`, `Testimonials`, `LogoBar` toegevoegd (`apps/site/src/components/blocks/`) naast de bestaande Hero/UspGrid/CtaBanner. `Hero.astro`'s `imageUrl: string`-prop is `image: { url, alt }`-object geworden (consistent met hoe Payload een upload-relatie met depth teruggeeft).
- **`BlockRenderer.astro`**: één schakelpunt (`block.blockType` → component), zodat `[id].astro` niet zelf per blocktype hoeft te weten wat te renderen.
- **`apps/site/src/pages/preview/[id].astro`**: nieuwe, niet-geprerenderde route (`export const prerender = false`) die een pagina op ID ophaalt (incl. concept via `draft=true`), site-theme + `themeOverrides` merget (`mergeTheme()` in `theme.ts`) en de secties/blocks rendert met de bestaande `Section`/`BlockRenderer`-componenten.
- **`payload-client.ts`**: `getPageById(id, { draft })` toegevoegd naast de bestaande `getPageBySlug`.
- **"Voorbeeld bekijken"-knop** op de Pages-admin (`apps/cms/src/components/PagePreviewLink.tsx`, zelfde patroon als `SiteQuickLinks.tsx`) — opent `{NEXT_PUBLIC_SITE_PREVIEW_URL:-http://localhost:4321}/preview/{id}` in een nieuw tabblad.
- **API-key-auth aangezet**: `Users.ts` had `auth: true` zonder `useAPIKey` — de REST-calls van `apps/site` (`Authorization: users API-Key ...`) hadden dus nooit gewerkt. Nu `auth: { useAPIKey: true }`. Er is al een API-key gegenereerd voor de bestaande admin-user (info@ronklarenmedia.nl) en gezet in `apps/site/.env` (niet gecommit — zie `.env.example` voor uitleg waarom dit verplicht is).
- **Niet gedaan**: dit is een read-only preview via een losse route, géén Payload `admin.livePreview`-iframe met live-typen-zonder-opslaan (dat vereist de `@payloadcms/live-preview`-postMessage-bridge, die niet triviaal op Astro's SSG/SSR-model past). De preview toont de laatst opgeslagen concept-versie; ververs de tab na wijzigingen.
- **`apps/site` blijft verder een stub**: de préview-route is losstaand van `index.astro`/`[...slug].astro` — de "echte" site rendert nog niets vanuit Payload (zie hieronder).

## Hoe je een preset toevoegt (Gemini of anders)

1. Genereer JSON conform `.claude/skills/theme-field-schema/example-preset.json` (exact 87 keys + `name`, geen extra/ontbrekende sleutels, `opacity*`/`zIndex*` als getal, de rest als string).
2. Plak de JSON in de chat, of vraag om validatie + wegschrijven via een `payload run`-scriptje (zie git-geschiedenis voor het exacte patroon — laadt `.env` handmatig, want `payload run` doet dat niet automatisch).

## Bekende gaten / bewust uitgesteld

- **`apps/site` heeft nu 2 dingen**: de oude placeholder-`index.astro` (nog steeds statisch, niet gekoppeld) én de nieuwe `/preview/[id]`-route die wél echt uit Payload rendert. `getPageBySlug`/`getSite` bestaan nog steeds ongebruikt — een echte productiesite (via slug, niet ID, en met `SITE_ID`-scoping) is nog niet gebouwd.
- **Page-preview: gebouwd** (zie sessielog hierboven) — read-only via `/preview/{pageId}` + "Voorbeeld bekijken"-knop in de Pages-admin. Geen live-typen-zonder-opslaan (geen `admin.livePreview`-postMessage-bridge); dat blijft toekomstig werk als het nodig blijkt.
- **SEO/AI-search-laag nog niet aangesloten**: metaTitle/metaDescription/ogImage-velden bestaan (Instellingen-tab), maar geen enkele `.astro`-layout leest ze uit. Geen JSON-LD, geen `llms.txt`, geen sitemap.
- **Thema-tab UI is kaal**: alle 87 velden zijn plain `text`/`number`, geen colorpicker of font-dropdown — bewust, zie skill-bestand sectie D. Polish is toekomstig werk.
- **Blocks: alle CSV-categorieën met genoeg voorbeelden zijn nu gebouwd** (zie sessielog bovenaan). Nog open: Divider, Aankondigingsbalk, Working-hours (geen/weinig CSV-data) en een eventuele losse "full-width-duo"-variant op `fotoTekst`.

## Conventies om aan te houden

- Nieuwe blocks: content-only velden, geen per-block kleurkiezers — styling via `--var-*`-tokens met CSS-fallbackwaarden (zie `UspGrid.astro`/`CtaBanner.astro` als voorbeeld).
- Varianten zijn een select/radio-veld op één bloktype, geen apart component per variant (doc §7-principe, al toegepast in `hero.ts`, `fotoTekst.ts`, `uspGrid.ts`, `ctaBanner.ts`).
- Na elke Payload-veldwijziging: `pnpm run generate:types` in `apps/cms`, en check `pnpm exec tsc --noEmit` in zowel `apps/cms` als `apps/site`.
- Custom admin-componenten (zoals `ThemePresets`/`ThemePreview`) registreren als `type: "ui"`-veld met `admin.components.Field: "/src/components/X#X"` — importMap.js wordt door de dev-server meestal automatisch bijgewerkt.
