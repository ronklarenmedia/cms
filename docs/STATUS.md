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
| Blocks | 5 stuks: `hero`, `usp-grid`, `cta-banner`, `site-header`, `site-footer` |
| Header/footer per site, SEO per pagina | Echt (zie §3) |
| Platform-dashboard (`/`), Design kits (+ editor), Instellingen, Rapportages, Apps | **Nog mockup** (nagemaakte demo-data) |
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
src/blocks/         het block-systeem (contract, registry, Section, BlockRenderer, theme, 5 blocks, README)
src/db/             Drizzle-schema (schema.ts) en verbinding (index.ts)
src/lib/            auth.ts (Better Auth), auth-client.ts, session.ts (sessiecontrole)
src/mockup/         overgenomen Claude Design-mockup; nog in gebruik voor de mockup-schermen
scripts/            check-blocks.ts, create-user.ts
docs/               gemini-blocks-brief.md, dit bestand
```

**Datamodel** (`src/db/schema.ts`): `customers`; `sites` (`theme` jsonb = overrides op de 87 tokens uit
`src/blocks/theme.ts`, `layout` jsonb = `{header, footer}`, `status` draft/live); `pages` (`content` jsonb = lijst
secties, `slug` leeg = homepage, SEO-velden); `user`, `session`, `account`, `verification` (Better Auth, met `role` en
`customerId`).

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
- `src/mockup/logic.ts` bevat nog demo-data voor schermen die inmiddels echt zijn (o.a. componenten). Opruimen kan
  later; het bestand is niet type-gecontroleerd, dus controleer daarna alle mockup-schermen.

## 7. Wat ontbreekt (in voorgestelde volgorde)

1. ✅ Login en rollen, verwijder-bug.
2. ✅ Sitebrede header/footer, ✅ SEO per pagina.
   - ⏳ **Afbeeldingen uploaden**: wacht op keuze opslag (zie §8). Tot dan alleen URL-velden.
   - ⏳ **Resterende blocks** (FAQ, team, prijzen, stappen, tijdlijn, cases, galerij, breadcrumbs, video, lijst,
     stats, logo-bar, testimonials, tekst+beeld…): bij Gemini, zie de brief. Blocks die client-JS of een backend
     nodig hebben (formulieren, sliders, tabs, winkelwagen, cookiemelding) eerst overleggen.
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

- **Opslag voor uploads**: Cloudflare R2 (aanrader: gebruikte je eerder, je hebt Cloudflare; jij maakt bucket +
  S3-sleutels aan) of Vercel Blob?
- **Design kit-model**: een kit = een opgeslagen thema (set tokens) dat bij een klant hoort en waar sites naar
  verwijzen? De mockup toont 4 knoppen (accent, papier, lettertype, hoekafronding); de blocks gebruiken 87 tokens.
- **Plannen**: welke plannen bestaan er (BOJOB/PRO of Starter/Pro/Agency) en wat zijn de limieten?
- **Hosting van klantsites**: één multi-tenant app die per domein de juiste site toont, of een aparte Vercel-deploy
  per site? Dit bepaalt punt 4.
- **Klantportal**: moeten klanten later zelf inloggen (rol `klantgebruiker`), en wanneer?

## 9. Checklist voor deployen

- In Vercel: `DATABASE_URL`, `BETTER_AUTH_SECRET` (vaste waarde) en `BETTER_AUTH_URL` zetten. Zonder secret start de
  app niet in productie.
- Productie-database: tabellen `user`, `session`, `account`, `verification`, `sites`, `pages`, `customers` en de
  kolommen `sites.layout`, `pages.seo_title`, `pages.seo_description`, `pages.og_image`, `pages.noindex` moeten
  bestaan (geen migratiebestanden; zie §6). Gebruik `drizzle-kit export --sql` als naslag.
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
