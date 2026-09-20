# Status en overdracht — Ron Klaren Media platform

Stand: 19 september 2026 (commit `84c2c59` en later). Doel van dit bestand: thuis of op een andere computer
verder kunnen werken zonder de eerdere gesprekken. Er staan bewust **geen geheimen** in (geen connectiestring,
sleutels of wachtwoorden).

## 1. Waar staan we

Een multi-tenant platform om websites (en later apps) voor klanten te bouwen en te beheren. Websites worden opgebouwd
uit **blocks** (herbruikbare secties in code) met **thema-tokens**; noordster is supersnelle, goed vindbare sites
(ook voor AI-assistenten), geen visuele originaliteit per site.

| Onderdeel | Stand |
|---|---|
| Inloggen en rollen | Echt (Better Auth, e-mail + wachtwoord) |
| Klanten | Echt (overzicht, detail met websites, nieuw/wijzigen/verwijderen) |
| Websites | Echt (galerij, aanmaken, builder, voorbeeld, status Live/Concept) — **publiceren doet nog niets buiten de status** |
| Componenten (overzicht, editor, showcase) | Echt, op het block-register |
| Blocks | 14 stuks: `hero`, `section-heading`, `stats`, `logo-bar`, `testimonials`, `text-image`, `usp-grid`, `cta-banner`, `faq`, `pricing`, `process`, `team`, `site-header`, `site-footer` (de meeste door Gemini gebouwd, gecontroleerd met `check:blocks`) |
| Header/footer per site, SEO per pagina | Echt (zie §3) |
| Instellingen | Deels echt: **Algemeen**, **Koppelingen** (status), **Team & rollen**, **Beveiliging** (sessies). De overige tabs tonen "volgt" met wat ze nodig hebben (zie §3) |
| Platform-dashboard (`/`), Design kits (+ editor), Rapportages, Apps | **Nog mockup** (nagemaakte demo-data) |
| Zoekbalk en belletje bovenin | Nog niet functioneel |

## 2. Thuis verder werken

```bash
git clone https://github.com/ronklarenmedia/cms.git && cd cms
npm install
```

Maak `.env.local` (staat niet in git). Minimaal:

- `DATABASE_URL` — Neon-connectiestring (Neon-dashboard → Connection Details). Het is dezelfde database als op de
  andere computer, dus alle data en het account staan er al.
- `BETTER_AUTH_SECRET` — genereer met `openssl rand -base64 32`. Een andere waarde dan op de andere computer is prima
  voor lokaal werk (je logt dan op elke computer één keer in). Productie heeft zijn eigen, vaste waarde.
- (optioneel) `BETTER_AUTH_URL=http://localhost:3000`. De Neon-integratie zet ook `DATABASE_URL_UNPOOLED` en
  `NEON_BRANCH`; de app gebruikt die niet.

Daarna:

```bash
npm run dev            # http://localhost:3000 (bij een bezette poort 3001)
```

Inloggen kan met het bestaande account (`info@ronklarenmedia.nl`, rol platform-admin). Wachtwoord vergeten? Er is geen
reset-mail; draai `npm run create-user` in een terminal met hetzelfde e-mailadres, dan kun je het opnieuw instellen.
Nieuwe gebruikers maak je ook zo aan (registreren via de site staat uit).

## 3. Wat werkt, per onderdeel

**Inloggen en rollen** — rollen `platform-admin`, `medewerker`, `klantgebruiker`. Personeel (admin/medewerker) heeft
toegang; een klantgebruiker nog niet (klantportal volgt). Alleen de platform-admin mag verwijderen (klanten, websites).

**Klanten** — `/klanten`. Een klant met websites kan niet verwijderd worden (melding + uitgeschakelde knop); de
klantpagina toont zijn websites.

**Websites**
- `/websites/nieuw`: naam, klant, thema (Corporate/Warm), startpunt (Starter of Leeg). Maakt site + homepagina +
  header + footer.
- `/websites/[id]` (de builder): pagina's toevoegen/hernoemen/verwijderen; secties toevoegen, verplaatsen,
  dupliceren, verwijderen en bewerken via een formulier dat uit het Zod-schema van het block wordt gegenereerd;
  ongedaan maken/opnieuw; automatisch opslaan; desktop/tablet/mobiel-canvas; voorbeeld; publiceren (alleen status);
  website verwijderen (admin).
- **Header en footer** staan onder "Op alle pagina's" in de linkerkolom en verschijnen op elke pagina. Welke blocks
  in welke plek mogen staat in `src/app/websites/layout-slots.ts`.
- **Tab "Pagina"** (rechts): titel, URL, SEO-titel, omschrijving, afbeelding bij delen, noindex, met een
  zoekresultaat-voorbeeld. De homepage-URL staat vast.
- Voorbeeld: `/websites/[id]/voorbeeld/[pagina]` — zonder platformmenu, met thema, header/footer en SEO-metadata.
  Een voorbeeld staat altijd op noindex.

**Instellingen** — `/instellingen/[tab]`; alle tabs vragen `requireStaff()`.
- *Algemeen*: platformnaam (staat in het menu en de tabbladtitel), beheerdomein, taal, tijdzone, support-/afzenderadres,
  telefoon, KvK. Opgeslagen in `platform_settings` (één rij); alleen een platform-admin mag wijzigen. Niet alle velden doen
  al iets: de naam werkt direct, de rest is opgeslagen voor e-mail/facturen/hosting (staat zo bij de velden). Ontbreekt de
  rij of de tabel, dan gelden de standaardwaarden in `src/lib/platform-settings-schema.ts` (de app loopt niet stuk).
- *Team & rollen*: lijst met gebruikers; een platform-admin wijzigt rol (en bij een klantgebruiker de klant). Je kunt je
  eigen rol niet wijzigen. Nieuwe gebruikers maak je aan met `npm run create-user`.
- *Beveiliging*: eigen sessies bekijken en beëindigen (via Better Auth), uitloggen op alle andere apparaten, en het
  inlogbeleid (`authPolicy` in `src/lib/auth.ts`, dezelfde waarden als de configuratie).
- *Koppelingen*: alleen status, nooit sleutels of adressen. Live gemeten: **Neon** (één query, responstijd) en **Cloudflare R2**
  (`checkStorage()` in `src/lib/health.ts`: ondertekende HEAD op de bucket + of `R2_PUBLIC_URL` bereikbaar is; schrijft niets).
  Een aanwezige `ANTHROPIC_API_KEY` of `RESEND_API_KEY` toont "Sleutel ingesteld" (nog niet gecontroleerd, want die
  onderdelen bestaan nog niet); de rest staat op "Niet gekoppeld". R2-configuratie: `src/lib/r2.ts` (`getR2Config()`).
- *Thema, AI, Plannen & facturatie, Domeinen, Publicatie, Notificaties, Compliance*: tonen wat er komt en waar het op wacht
  (`src/app/instellingen/tabs.ts`), geen schakelaars die niets doen.

**Componenten** — `/componenten` (miniaturen, gebruik per site, aantal tokens), `/componenten/editor?block=…`
(werkbank: variant, voorbeeld, thema, breakpoint, eigenschappen, JSON-weergave; niets wordt opgeslagen) en
`/componenten/showcase`.

## 4. Architectuur in het kort

Stack: Next.js 16 (App Router), React 19, Tailwind 4, Drizzle ORM + Neon Postgres (`pg`), Zod 4, Better Auth,
Phosphor-icons. **Dit is niet de Next.js uit je hoofd**: `AGENTS.md` verwijst naar `node_modules/next/dist/docs/`
(o.a. `proxy.ts` in plaats van `middleware.ts`, `params`/`searchParams` zijn promises).

```
src/app/            routes (klanten, websites, componenten, login, api/auth, mockup-pagina's)
src/app/websites/   builder (SiteBuilder, SchemaForm, PageSettingsForm), acties, SiteFrame, layout-slots, seo, sections
src/blocks/         het block-systeem (contract, registry, Section, BlockRenderer, theme, 14 blocks, README)
src/db/             Drizzle-schema (schema.ts) en verbinding (index.ts)
src/lib/            auth.ts (Better Auth), auth-client.ts, session.ts (sessiecontrole)
src/mockup/         overgenomen Claude Design-mockup; nog in gebruik voor de mockup-schermen
scripts/            check-blocks.ts, create-user.ts
docs/               gemini-blocks-brief.md, dit bestand
```

**Datamodel** (`src/db/schema.ts`): `customers`; `sites` (`theme` jsonb = overrides op de 87 tokens uit
`src/blocks/theme.ts`, `layout` jsonb = `{header, footer}`, `status` draft/live); `pages` (`content` jsonb = lijst
secties, `slug` leeg = homepage, SEO-velden); `platform_settings` (één rij, `id = 1` afgedwongen met een CHECK);
`user`, `session`, `account`, `verification` (Better Auth, met `role` en `customerId`).

**Sectie-formaat**: `{ id, type, variant, content, settings }`. `BlockRenderer` valideert tegen het Zod-schema van
het block. Dezelfde validatie draait in de builder (`sections.ts`) en op de server (`parseSections`), en ongeldige
secties worden nooit opgeslagen.

**Blocks** zijn code (`src/blocks/<slug>/` met `schema.ts`, `Component.tsx`, `fixtures.ts`, `styles.css`, `index.ts`).
Alle regels staan in `src/blocks/README.md`; `npm run check:blocks` controleert ze. Gemini bouwt de overige blocks
volgens `docs/gemini-blocks-brief.md`.

**Beveiliging in twee lagen**: `src/proxy.ts` kijkt alleen of er een sessiecookie is (snel, optimistisch); de echte
controle staat in **elke pagina en server-actie** via `src/lib/session.ts` (`requireStaff`, `staffUser`,
`requireAdmin`). Server-acties zijn openbare endpoints: elke nieuwe actie moet zelf de sessie controleren.

## 5. Genomen beslissingen

- Login: Better Auth in de eigen Postgres (niet Neon Auth), zodat rollen en klantkoppeling naast `customers` staan.
- Registreren staat uit; accounts via `npm run create-user` (vraagt om een terminal, wachtwoord verborgen).
- Medewerkers mogen alles behalve verwijderen; verwijderen is voor de platform-admin.
- Klant met websites niet verwijderbaar (geen automatisch mee-verwijderen).
- Blocks blijven in code; de componenteditor is een werkbank, geen ontwerptool. Geen "Nieuw component"/"Publiceren".
- Header/footer zijn gewone blocks in vaste plekken (slots), geen aparte editor. Een extra footer-lay-out is een
  nieuwe *variant* van `site-footer`.
- Mobiel menu zonder client-JS (`<details>`), uitklapmenu's met CSS (hover/focus).
- Alle pagina's zijn dynamisch gerenderd (de layout leest de sessie).
- **Opslag voor uploads: Cloudflare R2** (niet Vercel Blob): bandbreedte is gratis, S3-compatibel en niet aan de hosting
  gebonden. Bucket `cms-media` (West-Europa) staat in Rons Cloudflare-account (`348598c3…`). Bestanden worden bewaard als
  **pad**, niet als volledige URL, zodat een domeinwissel alleen `R2_PUBLIC_URL` raakt.
- **Domein voor bestanden: `media.rkmassets.com`** (via R2 → Custom Domains). Bewust géén `.download`/`.stream`: die
  extensies staan op lijsten van veel misbruikte TLD's en worden door sommige spamfilters en firewalls geblokkeerd
  (bezoeker ziet dan een site zonder afbeeldingen). `cloud-cdn.download` en `media-cdn.stream` zijn wel gekocht: niet
  gebruiken en automatisch verlengen uitzetten.
- Op termijn het liefst afbeeldingen via het **eigen domein van de klant** serveren (`klant.nl/media/…`): geen extra
  verbinding, niet te blokkeren als apart CDN-domein. Hangt samen met de hostingkeuze (§8).

## 6. Valkuilen

- **Nooit `drizzle-kit push` beantwoorden met "ja".** Bij de laatste pogingen wilde hij een bestaande unique constraint
  op `pages` opnieuw toevoegen en vroeg hij of hij de tabel moest **legen**. Databasewijzigingen zijn tot nu toe met
  handgeschreven, additieve SQL in een transactie gedaan (`drizzle-kit export --sql` toont de verwachte DDL).
  Er zijn nog **geen migratiebestanden**; productie en lokaal kunnen dus uit de pas lopen.
- Pagina's die database-data tonen moeten dynamisch zijn (anders worden ze bij de build voorgerenderd en blijven ze
  oud). `requireStaff()` doet dat vanzelf.
- React Compiler-lintregels: geen refs lezen of `Date.now()` aanroepen tijdens renderen (`npm run lint` vangt dit).
- Nooit een block in een `<a>`/`<Link>` zetten: blocks bevatten zelf links (geneste `<a>` = hydratatiefout).
- Blocks: geen `style=`, geen `@media` (gebruik `@container blk`), geen hex-kleuren, geen client-JS, alleen
  `--var-*`-tokens; de checker weigert anders. `contract.ts`, `theme.ts`, `Section.tsx`, `BlockRenderer.tsx`,
  `parts/*` en de checker niet aanpassen zonder overleg.
- `npm audit` meldt 4 moderate kwetsbaarheden: allemaal esbuild via `drizzle-kit` (alleen dev-tool). Bewust genegeerd;
  er is geen stabiele `drizzle-kit` zonder dit lek. `npm audit fix --force` zou een downgrade doen: niet doen.
- De Better Auth-waarschuwing "Base URL is not set" is lokaal onschuldig; zet `BETTER_AUTH_URL` in productie.
- Authenticated schermen zijn door Claude niet visueel te testen (geen wachtwoorden invoeren, geen accounts
  aanmaken). Test die zelf, of log in de browserpane zelf in.
- `src/lib/platform-settings-schema.ts` (types, standaardwaarden, validatie) mag ook in client-componenten; `platform-settings.ts`
  leest de database en mag dat **niet** (dan komt `pg` in de browserbundel en faalt `npm run build`).
- **R2-sleutels staan in `.env.local`** (niet in git; wint van `.env`). De oude `R2_*`-regels uit `.env` hoorden bij een ander
  Cloudflare-account (`3fd8c6…`) en zijn verwijderd. Bucket en domein moeten in hetzelfde account staan. Een token met rechten op één bucket geeft 403 (geen 404) bij een verkeerde bucketnaam.
- `src/mockup/logic.ts` bevat nog demo-data voor schermen die inmiddels echt zijn (o.a. componenten). Opruimen kan
  later; het bestand is niet type-gecontroleerd, dus controleer daarna alle mockup-schermen.

## 7. Wat ontbreekt (in voorgestelde volgorde)

1. ✅ Login en rollen, verwijder-bug.
2. ✅ Sitebrede header/footer, ✅ SEO per pagina.
   - ⏳ **Afbeeldingen uploaden**: opslag is gekozen (R2, §5) en de verbinding is live te controleren (Koppelingen). Nog te
     bouwen: upload-actie met controle (alleen staff, type en grootte), verkleinen naar meerdere formaten + WebP
     (`sharp` staat al in `node_modules`), CORS op de bucket, opslag onder `<klant>/<site>/…`. Tot dan alleen URL-velden.
   - ⏳ **Resterende blocks** (tijdlijn, cases, galerij, breadcrumbs, video, lijst…): bij Gemini, zie de brief. Blocks die
     client-JS of een backend nodig hebben (formulieren, sliders, tabs, winkelwagen, cookiemelding) eerst overleggen.
   - Bekende puntjes in de blocks van Gemini (niet blokkerend): `testimonials` levert `Review`-JSON-LD zonder
     `itemReviewed` (Google gebruikt dat niet voor review-snippets) en de sterren hebben `aria-label` op een gewone `div`
     (hoort `role="img"` te krijgen); `logo-bar` noemt de naam zowel in de `alt` als in een `sr-only`-tekst (dubbel
     voorgelezen); `team` zet `position` op de `Person` in plaats van op een `ListItem` en gebruikt een relatieve
     `image`-URL in de JSON-LD.
3. **Design kits**: eerst het model kiezen (zie §8). Daarna plannen/prijsmodel (de database kent BOJOB/PRO, de mockup
   Starter/Pro/Agency).
4. **Echt publiceren**: sites serveren (per domein), domeinen/DNS, versiegeschiedenis en terugrollen (snapshot bij
   publiceren), deploy-log. Daarna **Instellingen** (Koppelingen, Team & rollen, Plannen, Domeinen, …) en het
   **Platform-dashboard** (klanten/websites-aantallen kan nu al uit de database; deploys en bezoekers hebben
   punt 4 en een analytics-bron nodig).
5. **AI** (Anthropic: AI-aanpassing in de builder is nu uitgeschakeld; generator, credits), **Rapportages**, **Apps**.
6. Opruimwerk: migratiebestanden, tests (nu alleen `check:blocks`), echte README, gebruikersbeheer-scherm,
   wachtwoord-reset per mail, tweestapsverificatie, opruimen van `logic.ts`, zoekbalk/meldingen.

## 8. Open vragen aan Ron

- **Design kit-model**: een kit = een opgeslagen thema (set tokens) dat bij een klant hoort en waar sites naar
  verwijzen? De mockup toont 4 knoppen (accent, papier, lettertype, hoekafronding); de blocks gebruiken 87 tokens.
- **Plannen**: welke plannen bestaan er (BOJOB/PRO of Starter/Pro/Agency) en wat zijn de limieten?
- **Hosting van klantsites**: één multi-tenant app die per domein de juiste site toont, of een aparte Vercel-deploy
  per site? Dit bepaalt punt 4.
- **Klantportal**: moeten klanten later zelf inloggen (rol `klantgebruiker`), en wanneer?

## 9. Checklist voor deployen

- In Vercel: `DATABASE_URL`, `BETTER_AUTH_SECRET` (vaste waarde) en `BETTER_AUTH_URL` zetten. Zonder secret start de
  app niet in productie.
- Productie-database: tabellen `user`, `session`, `account`, `verification`, `sites`, `pages`, `customers`, `platform_settings` en de
  kolommen `sites.layout`, `pages.seo_title`, `pages.seo_description`, `pages.og_image`, `pages.noindex` moeten
  bestaan (geen migratiebestanden; zie §6). Gebruik `drizzle-kit export --sql` als naslag. `platform_settings` is lokaal al
  aangemaakt (dezelfde Neon-database); staat productie op een andere database, maak hem dan daar aan met de DDL uit
  `drizzle-kit export --sql` (`CREATE TABLE "platform_settings"` + de foreign key naar `user`). Zonder de tabel werkt de app nog
  wel (standaardwaarden), maar opslaan onder Instellingen → Algemeen mislukt met een melding.
- R2 in productie: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`, `R2_PUBLIC_URL` als omgevingsvariabelen
  (zie `.env.example`). Controleer daarna Instellingen → Koppelingen. Voor uploads uit de browser: CORS op de bucket met het
  platformdomein als toegestane herkomst.
- Daarna een admin aanmaken met `npm run create-user` (tegen de productie-database).

## 10. Werkafspraken

- Taal: Nederlands voor de interface, commentaar en commitberichten.
- Committen en pushen alleen op verzoek; direct op `main`. Commitbericht: korte titel, lijst met wat en waarom,
  en `Co-Authored-By`-regel.
- Voor een commit draaien: `npx tsc --noEmit`, `npx eslint src scripts`, `npm run check:blocks`, `npm run build`.
- Databasewijzigingen additief en handmatig, in een transactie; nooit `drizzle-kit push` blindelings.
- Server-acties en pagina's met data controleren altijd zelf de sessie.

## 11. Nuttige commando's

```bash
npm run dev                # ontwikkelserver
npm run check:blocks       # controleert alle blocks tegen het contract
npm run build              # productiebuild (vangt ook type- en lintfouten)
npm run create-user        # gebruiker aanmaken of wachtwoord opnieuw instellen (in een terminal)
node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql   # verwachte DDL tonen (niet uitvoeren)
```

## 12. Handmatig te testen (nog niet visueel geverifieerd met een ingelogde sessie)

- Inloggen, uitloggen, en dat je zonder login naar `/login` wordt gestuurd.
- Klantpagina: websites zichtbaar; een klant met websites laat zich niet verwijderen.
- Builder: header en footer toevoegen via "Op alle pagina's"; ze verschijnen in het canvas, klikken erop schakelt
  naar die plek; ongedaan maken per plek.
- Tab "Pagina": SEO opslaan; een bestaande URL wordt geweigerd; het voorbeeld toont de juiste titel en header/footer.
- Menulinks in de header: kiezen uit de pagina's van de site.
- Instellingen → Koppelingen: Neon en Cloudflare R2 staan op "Verbonden" (R2 met "openbare URL bereikbaar"); zet tijdelijk een
  verkeerde `R2_BUCKET` in `.env.local` en zie de melding "Storing".
