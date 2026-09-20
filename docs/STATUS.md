# Status en overdracht — Ron Klaren Media platform

Stand: 21 september 2026 (commit `2b5e58f` en later). **Het platform draait in productie op Vercel** (zie §9). Doel van dit bestand: thuis of op een andere computer
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
| Productie | **Live** op Vercel: beheer op `https://platform.ronklarenmedia.nl` (noodadres `rkm-platform.vercel.app`), voorbeeldadressen op `<sitenaam>.rkmsites.dev`, Neon-branch `production`, R2 voor beelden. Details en instellingen in §9 |
| Websites | Echt en **in productie bewezen** (galerij, aanmaken, builder, voorbeeld, **publiceren als versie met terugrollen**, openbare weergave op `<sitenaam>.rkmsites.dev`, **eigen domeinen van klanten**: toevoegen, activeren, primair, doorverwijzen, sitemap/robots, verwijderen) |
| Componenten (overzicht, editor, showcase) | Echt, op het block-register |
| Blocks | 20 stuks: `hero`, `section-heading`, `stats`, `logo-bar`, `testimonials`, `text-image`, `usp-grid`, `cta-banner`, `faq`, `pricing`, `process`, `team`, `timeline`, `cases`, `gallery`, `breadcrumbs`, `video`, `list`, `site-header`, `site-footer` (14 door Gemini/eerder, de laatste zes door Claude; allemaal gecontroleerd met `check:blocks`) |
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
  ongedaan maken/opnieuw; automatisch opslaan; desktop/tablet/mobiel-canvas; voorbeeld; publiceren met versies (zie hieronder);
  website verwijderen (admin).
- **Afbeeldingen uploaden**: elk beeldveld in de builder (`url` + `alt`) heeft een voorbeeld en een uploadknop
  (`ImageUpload.tsx`, server-actie `uploadImage` in `upload.ts`, verwerking in `src/lib/media.ts`). Alleen JPG/PNG/WebP/GIF/AVIF, max. 5 MB
  (grotere foto's worden in de browser eerst verkleind); SVG wordt bewust geweigerd. Per upload maakt `sharp` WebP-varianten van
  480/960/1600 px (nooit opschalen), zonder EXIF/GPS, en zet ze onder `sites/<siteId>/<uuid>/<breedte>.webp` in R2 met
  `immutable`-cache. Het veld krijgt `url` (grootste variant), `width`, `height` en `srcset` (verborgen); `<Img>` zet `srcset` en
  `sizes` (standaard `100vw`). Een handmatig gewijzigde URL wist de `srcset`. Alleen in de builder; de componentwerkbank heeft geen upload.
  **Mediabibliotheek** ("Kies uit bibliotheek" bij elk beeldveld, `MediaLibrary.tsx`, acties in `media.ts`): alle beelden van de
  site, nieuwste eerst, met bestandsnaam, afmetingen, grootte en "in gebruik (n×)" (zoekt het `id` in de opgeslagen pagina's en
  header/footer). Een beeld kiezen vult het veld. Verwijderen (alleen platform-admin) wist de rij en alle bestanden in R2, en
  weigert als het beeld nog in gebruik is of nu in het veld staat. Een site verwijderen ruimt ook alle bestanden in R2 op.
- **Header en footer** staan onder "Op alle pagina's" in de linkerkolom en verschijnen op elke pagina. Welke blocks
  in welke plek mogen staat in `src/app/(beheer)/websites/layout-slots.ts`.
- **Tab "Pagina"** (rechts): titel, URL, SEO-titel, omschrijving, afbeelding bij delen, noindex, met een
  zoekresultaat-voorbeeld. De homepage-URL staat vast.
- Voorbeeld: `/websites/[id]/voorbeeld/[pagina]` — de **werkkopie** zonder platformmenu, met thema, header/footer en SEO-metadata.
- **Publiceren** (`publish.ts`, `publishing.ts`): "Publiceren" valideert alle pagina's en de header/footer, legt de site vast als nieuwe rij in
  `site_versions` (thema, header/footer en pagina's als jsonb; de laatste 20 blijven bewaard) en zet `sites.published_version` daarop. Is er niets
  gewijzigd sinds de live versie, dan komt er geen nieuwe versie. "Op concept zetten" haalt de site offline (versies blijven). "Versies" toont de
  lijst en zet een oudere versie weer live; de werkkopie blijft dan zoals hij is. Naast "Live · vN" staat "Niet-gepubliceerde wijzigingen" zodra de
  werkkopie afwijkt (vergelijking via `content_hash`, na elke opslag opnieuw bepaald op de server).
- **Openbare weergave** (`src/app/(sites)/s/[host]/[[...pagina]]`): toont alleen de live versie, nooit de werkkopie. Zie §4.
- **Eigen domeinen** (knop "Domeinen" in de builder, `DomainsDialog.tsx`, acties in `domains.ts`, tabel `site_domains`, Vercel-koppeling in `src/lib/vercel-domains.ts`):
  een domein toevoegen valideert de naam (`validateCustomHostname`: geen poort/IP/wildcard/localhost, en niets van het platform zelf), meldt het aan bij Vercel en toont de
  DNS-records (A voor een kaal domein, CNAME voor een subdomein, en een TXT-record als het domein al elders bij Vercel hangt), met "Controleer nu". Status: *Actief* = geverifieerd en
  DNS wijst naar Vercel, anders *In behandeling*. Het eerste domein wordt **primair**; wie via een ander adres van de site binnenkomt (www ↔ kaal, het voorbeeldadres) krijgt een
  308 naar het primaire domein zodra dat actief is. Maximaal 5 domeinen per site; verwijderen (ook bij Vercel) alleen door een platform-admin; een site verwijderen maakt zijn
  domeinen bij Vercel los. Per eigen domein: `robots.txt` (toestaan, met sitemap) en `sitemap.xml` (pagina's zonder `noindex`); een voorbeeldadres krijgt `Disallow: /` en geen sitemap.
  Zonder Vercel-instellingen worden domeinen alleen opgeslagen (met een melding).
  Een voorbeeld staat altijd op noindex.
  **Bewezen tegen echt Vercel** (21 sept 2026, met een subdomein van `ronklarenmedia.nl`): toevoegen (was meteen actief), certificaat, primair, 308 vanaf het voorbeeldadres met behoud van het pad, `robots.txt`/`sitemap.xml`,
  publiceren dat direct doorkomt, en verwijderen (het domein is daarna ook uit het Vercel-project). De DNS-regel bij de registrar moet je zelf weghalen.

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
  **Vercel** wordt live gemeten (`checkVercel()` in `src/lib/vercel-domains.ts`: het project opvragen bewijst dat `PLATFORM_VERCEL_TOKEN`, het project-id en eventueel `PLATFORM_VERCEL_TEAM_ID` kloppen).
- *Thema, AI, Plannen & facturatie, Domeinen, Publicatie, Notificaties, Compliance*: tonen wat er komt en waar het op wacht
  (`src/app/(beheer)/instellingen/tabs.ts`), geen schakelaars die niets doen.

**Componenten** — `/componenten` (miniaturen, gebruik per site, aantal tokens), `/componenten/editor?block=…`
(werkbank: variant, voorbeeld, thema, breakpoint, eigenschappen, JSON-weergave; niets wordt opgeslagen) en
`/componenten/showcase`.

## 4. Architectuur in het kort

Stack: Next.js 16 (App Router), React 19, Tailwind 4, Drizzle ORM + Neon Postgres (`pg`), Zod 4, Better Auth,
Phosphor-icons. **Dit is niet de Next.js uit je hoofd**: `AGENTS.md` verwijst naar `node_modules/next/dist/docs/`
(o.a. `proxy.ts` in plaats van `middleware.ts`, `params`/`searchParams` zijn promises).

```
src/app/(beheer)/   het beheer: routes (klanten, websites, instellingen, componenten, login, …) met eigen root-layout (sessie, AppShell, Tailwind/Nocturne)
src/app/(sites)/    openbare sites: eigen root-layout zonder sessie of beheer-CSS; `s/[host]/[[...pagina]]` bouwt de live versie op (ISR)
src/app/api/auth    Better Auth
src/proxy.ts        stuurt een host die niet in PLATFORM_HOSTS staat intern door naar /s/<host>/…; blokkeert /s/ en /api op openbare hosts
src/app/(beheer)/websites/   builder (SiteBuilder, SchemaForm, PageSettingsForm), acties, SiteFrame, layout-slots, seo, sections
src/blocks/         het block-systeem (contract, registry, Section, BlockRenderer, theme, 20 blocks, README)
src/db/             Drizzle-schema (schema.ts) en verbinding (index.ts)
src/lib/            auth.ts (Better Auth), auth-client.ts, session.ts (sessiecontrole)
src/mockup/         overgenomen Claude Design-mockup; nog in gebruik voor de mockup-schermen
scripts/            check-blocks.ts, create-user.ts
docs/               gemini-blocks-brief.md, dit bestand
```

**Datamodel** (`src/db/schema.ts`): `customers`; `sites` (`theme` jsonb = overrides op de 87 tokens uit
`src/blocks/theme.ts`, `layout` jsonb = `{header, footer}`, `status` draft/live); `pages` (`content` jsonb = lijst
secties, `slug` leeg = homepage, SEO-velden); `platform_settings` (één rij, `id = 1` afgedwongen met een CHECK);
`media` (één rij per geüpload beeld van een site: `id` = mapnaam in R2, `url`, `srcset`, afmetingen, `filename`, `bytes`; verdwijnt mee met de site);
`site_domains` (eigen domeinen per site: `hostname` uniek, `is_primary` hoogstens één per site, `status` pending/active);
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
- Het beheer is dynamisch gerenderd (de layout leest de sessie). **Openbare sites zijn statisch** (ISR): hun eigen root-layout leest geen sessie,
  en publiceren maakt de cache van die site ongeldig met `revalidatePath('/s/<host>/<pagina>')` **per host en per pagina, zonder `type`** (zie §6: `type: "layout"` werkt hier niet), met als vangnet `revalidate = 600` op de sitepagina.
- **Publiceren = momentopname** (`site_versions`), niet de werkkopie live zetten: een autosave gaat nooit direct naar bezoekers.
- **Voorbeeldadres per site:** `<sitenaam>.<PREVIEW_DOMAIN>` met `PREVIEW_DOMAIN=rkmsites.dev` (apart domein, niet `rkmassets.com`, zie `docs/hosting-opties.md` §6). Voorbeeldadressen krijgen
  altijd `noindex`. Eigen domeinen van klanten: zie §3 (tabel `site_domains` + Vercel-API).
- **Opslag voor uploads: Cloudflare R2** (niet Vercel Blob): bandbreedte is gratis, S3-compatibel en niet aan de hosting
  gebonden. Bucket `cms-media` (West-Europa) staat in Rons Cloudflare-account (`348598c3…`). Bestanden worden bewaard als
  **volledige URL** opgeslagen in de paginadata (`image.url`/`srcset`): `og:image` en JSON-LD hebben absolute adressen nodig en
  het builder-canvas rendert in de browser, waar `R2_PUBLIC_URL` niet beschikbaar is. Bij een domeinwissel dus één keer de oude
  basis-URL vervangen in `pages.content`/`sites.layout` (bijv. `update pages set content = replace(content::text, 'oud', 'nieuw')::jsonb`).
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
- Uploads lopen via een **server-actie** (geen presigned uploads), dus er is **geen CORS** op de bucket nodig. De limiet voor
  server-acties staat op 6 MB (`next.config.ts`); Vercel zelf staat maar 4,5 MB per verzoek toe, vandaar dat de browser
  foto's boven 3 MB eerst verkleint. `sharp` is een directe afhankelijkheid (Next gebruikt hem ook).
- **R2-sleutels staan in `.env.local`** (niet in git; wint van `.env`). De oude `R2_*`-regels uit `.env` hoorden bij een ander
  Cloudflare-account (`3fd8c6…`) en zijn verwijderd. Bucket en domein moeten in hetzelfde account staan. Een token met rechten op één bucket geeft 403 (geen 404) bij een verkeerde bucketnaam.
- **Routegroepen:** het beheer staat in `src/app/(beheer)`, de openbare sites in `src/app/(sites)`; beide hebben een eigen root-layout, dus er is bewust geen
  `src/app/layout.tsx`. `/s/…` is alleen intern (de proxy geeft er een 404 op); `revalidatePath` moet het **doelpad** krijgen (`/s/<host>`), niet het adres
  in de adresbalk (details in de valkuil hieronder). Zonder `PLATFORM_HOSTS` is alles beheer en toont de app nooit een openbare site (veilige standaard).
- **Gewicht van een openbare pagina:** de Next-runtime levert ~170 KB gzip JavaScript mee (567 KB onverpakt), hoewel geen enkel block interactief is; HTML ~7 KB en CSS
  ~6 KB gzip. `react-dom/server` mag niet in een routehandler (bouwfout), maar `react-dom/static` (`prerender`) wel en levert HTML zonder scripts; zie
  `docs/hosting-opties.md` §5 voor het vervolg.
- **Cache van openbare sites leegmaken (ISR):** een gecachete pagina heeft twee soorten tags: die van het routepatroon (`/s/[host]/layout`, gelden voor álle sites) en de exacte pad-tag
  `/s/<host>/<pagina>` (zonder `/layout`). `revalidatePath('/s/<host>', 'layout')` past bij geen enkele pagina en doet stil niets; zo bleef een gepubliceerde wijziging in productie
  onzichtbaar. Juist is een letterlijk pad per host en pagina zonder `type` (`revalidatePublicSite` in `src/lib/site-domains.ts`, met de slugs uit alle bewaarde versies). **De dev-server cachet niets, dus dit
  is lokaal niet te testen**: bouw met `npm run build`, start `next start` en lees de tags uit `.next/server/app/s/<host>.meta` (`x-next-cache-tags`), of test op Vercel (publiceer, kijk of `x-vercel-cache`/`age` verspringt).
  Wijzigt iets aan het cachen, test dan altijd in een productiebuild.
- **`sitemap.xml` en `robots.txt` onder `[host]` staan op `force-dynamic`.** Next bouwt een route met de naam `sitemap.xml` anders bij het bouwen één keer vooraf met de nepnaam `-` als host: de
  build raakte dan de database (faalde als die niet bereikbaar was) en elke echte host viel bij de paginaroute terecht (404 in plaats van XML). Verwijder die regel niet.
- **`DATABASE_URL` mag alles bevatten wat Neon levert** (`?sslmode=require&channel_binding=require`). `src/db/index.ts` knipt alleen `sslmode` eruit en laat het scheidingsteken staan; een eerdere regex nam het `?` mee
  en gaf de databasenaam `neondb&channel_binding=require` (alleen zichtbaar in productie, want lokaal stond er geen `channel_binding`).
- **Vercel-variabelen:** eigen namen mogen **niet** met `VERCEL_` beginnen (daarom `PLATFORM_VERCEL_*`; `VERCEL_PROJECT_ID` is een systeemvariabele en komt vanzelf). Een gevoelige variabele is in Vercel niet meer
  te bekijken, alleen te vervangen (Edit → veld wissen → nieuwe waarde). Een gewijzigde variabele werkt pas na een **Redeploy als Production**. Controle achteraf: Instellingen → Koppelingen (die noemt bij "Niet
  gekoppeld" precies welke variabelen ontbreken, maar niet `R2_PUBLIC_URL`: die is optioneel en geeft "Openbare URL ontbreekt").
- **Eén Vercel-project per repo:** bij de eerste import zijn per ongeluk meerdere projecten uit `ronklarenmedia/cms` ontstaan (`rkm-platform`, `cms-…`); alleen `rkm-platform` hoort er te zijn. Controleer dat de
  andere projecten niet meer aan de repo gekoppeld zijn (anders bouwt elke push meerdere keren). Een project hernoemen verandert het `.vercel.app`-adres niet: `rkm-platform.vercel.app` is er handmatig aan toegevoegd
  (Settings → Domains). Raak `site-builder`, `rkm-portaal`, `welzijns-connect` en `focus-flow` niet aan (andere projecten). Het project `cms` is ouder (13 september 2026): controleer of het aan deze repo hangt en of je het nog nodig hebt.
- `src/mockup/logic.ts` bevat nog demo-data voor schermen die inmiddels echt zijn (o.a. componenten). Opruimen kan
  later; het bestand is niet type-gecontroleerd, dus controleer daarna alle mockup-schermen.

## 7. Wat ontbreekt (in voorgestelde volgorde)

1. ✅ Login en rollen, verwijder-bug.
2. ✅ Sitebrede header/footer, ✅ SEO per pagina.
   - ✅ **Afbeeldingen uploaden** en **mediabibliotheek** in de builder (zie §3). Nog te doen: **SVG-logo's** (eerst
     sanitizen), upload/kiezen voor het delen-beeld (`og_image`, nu nog een URL-veld in tab Pagina), het `sizes`-attribuut per
     block (nu overal `100vw`, ook voor halve kolommen), een **bulk-opruiming van ongebruikte beelden** en een aparte
     mediapagina buiten de builder. Verweesde bestanden ontstaan nog wel als een gebruiker een beeld uit een veld haalt
     zonder het uit de bibliotheek te verwijderen; dat is bewust (het beeld blijft kiesbaar).
   - ✅ **Blocks uit de brief zijn af** (batch 1–3). De laatste zes (`timeline`, `cases`, `gallery`, `breadcrumbs`, `video`, `list`) zijn
     door Claude gebouwd, status `beta`, gecontroleerd op desktop/tablet/mobiel in beide thema's. Nog niet gebouwd: blocks die
     client-JS of een backend nodig hebben (formulieren, sliders, tabs, winkelwagen, cookiemelding, lightbox): eerst overleggen.
     Aandachtspunten bij de nieuwe blocks: `breadcrumbs` zet relatieve adressen in de `BreadcrumbList`-JSON-LD (net als `team`; absoluut
     maken zodra sites een domein hebben); `video` laadt YouTube/Vimeo pas na een klik (een ingeklapte `<details>` met de iframe erin,
     zonder JavaScript), speelt dus na de eerste klik nog niet automatisch af, en de fixture met een eigen bestand wijst naar een
     niet-bestaand `/blocks/rondleiding.mp4` (alleen om de weergave te tonen); `gallery` heeft geen lightbox (die vraagt client-JS).
   - Bekende puntjes in de blocks van Gemini (niet blokkerend): `testimonials` levert `Review`-JSON-LD zonder
     `itemReviewed` (Google gebruikt dat niet voor review-snippets) en de sterren hebben `aria-label` op een gewone `div`
     (hoort `role="img"` te krijgen); `logo-bar` noemt de naam zowel in de `alt` als in een `sr-only`-tekst (dubbel
     voorgelezen); `team` zet `position` op de `Person` in plaats van op een `ListItem` en gebruikt een relatieve
     `image`-URL in de JSON-LD.
3. **Design kits**: eerst het model kiezen (zie §8). Daarna plannen/prijsmodel (de database kent BOJOB/PRO, de mockup
   Starter/Pro/Agency).
4. **Echt publiceren** — ✅ momentopnamen, terugrollen, openbare weergave en **eigen domeinen** (DNS-instructies, controle, primair, www ↔ kaal, robots/sitemap).
   ✅ **Live op Vercel en de Vercel-koppeling bewezen** (Pro-team, project `rkm-platform`, `rkmsites.dev`, `platform.ronklarenmedia.nl`). Nog te doen: absolute URL's in JSON-LD, een platformbreed domeinenoverzicht onder Instellingen → Domeinen, automatisch periodiek controleren van
   domeinen in behandeling, **JS-loze openbare pagina's** (zie hierboven), publiceer-notitie in de UI, deploy-log, **testdata op `production` opruimen** (testsite "Ron's eerste test" met 8 versies), een herinnering voor het
   vervallen van het Vercel-token, en een **opmaakfout in de builder**: onder ongeveer 1000 px breed wordt de knop "Domeinen" afgedekt door het instellingenpaneel (de werkbalk loopt onder het paneel door). Daarna **Instellingen** (Koppelingen, Team & rollen, Plannen, Domeinen, …) en het
   **Platform-dashboard** (klanten/websites-aantallen kan nu al uit de database; deploys en bezoekers hebben
   punt 4 en een analytics-bron nodig).
5. **AI** (Anthropic: AI-aanpassing in de builder is nu uitgeschakeld; generator, credits), **Rapportages**, **Apps**.
6. Opruimwerk: migratiebestanden, tests (nu alleen `check:blocks`), echte README, gebruikersbeheer-scherm,
   wachtwoord-reset per mail, tweestapsverificatie, opruimen van `logic.ts`, zoekbalk/meldingen.

## 8. Open vragen aan Ron

- **Design kit-model**: een kit = een opgeslagen thema (set tokens) dat bij een klant hoort en waar sites naar
  verwijzen? De mockup toont 4 knoppen (accent, papier, lettertype, hoekafronding); de blocks gebruiken 87 tokens.
- **Plannen**: welke plannen bestaan er (BOJOB/PRO of Starter/Pro/Agency) en wat zijn de limieten?
- **Hosting van klantsites**: uitgewerkt in `docs/hosting-opties.md` (opties A–E, kosten, advies en vier vragen). Advies: één multi-tenant
  Next.js-app op Vercel Pro; kosten beslissen dit niet (ca. $40 per maand bij 150 sites, ca. $120 bij 1000). Besloten en uitgevoerd: A (Vercel Pro), klant bepaalt wie de DNS regelt, voorbeeldadressen op `rkmsites.dev`. Momentopnamen en eigen domeinen zijn gebouwd en in productie bewezen.
- **Klantportal**: moeten klanten later zelf inloggen (rol `klantgebruiker`), en wanneer?

## 9. Checklist voor deployen

- **Productie staat** (21 september 2026): Vercel Pro-team `ron-klaren-medias-projects`, project `rkm-platform` (repo `ronklarenmedia/cms`, branch `main` = Production, regio `fra1` via `vercel.json`).
  Adressen: beheer `platform.ronklarenmedia.nl` (CNAME bij Strato naar `cname.vercel-dns.com`; de rest van dat domein en de mail zijn ongemoeid), noodadres `rkm-platform.vercel.app`, voorbeeldadressen `<sitenaam>.rkmsites.dev`
  (`rkmsites.dev` en `*.rkmsites.dev` in het project; de nameservers staan bij Vercel). Variabelen (alleen namen; alle op Production): `DATABASE_URL` (Neon `production`, gepoold), `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_URL=https://platform.ronklarenmedia.nl`, `PLATFORM_HOSTS=*.vercel.app,platform.ronklarenmedia.nl` (houd `*.vercel.app` erin als noodadres), `PREVIEW_DOMAIN=rkmsites.dev`, de vijf `R2_*`,
  `PLATFORM_VERCEL_TOKEN` en `PLATFORM_VERCEL_TEAM_ID`. Het token vervalt op de datum die bij het aanmaken is gekozen (Vercel → Account Settings → Tokens): vernieuw het dan en vervang de variabele.
- **Stap voor stap** (het oorspronkelijke stappenplan): zie `docs/deploy-vercel.md`. Onderstaande blijft de losse checklist.
- **Twee databasebranches** (besloten en aangemaakt): lokaal `main`, productie `production` (Neon-project `rkm-platform`). Databasewijzigingen eerst op `main`, dan op `production`, vóór het deployen.
- In Vercel: `DATABASE_URL`, `BETTER_AUTH_SECRET` (vaste waarde) en `BETTER_AUTH_URL` zetten. Zonder secret start de
  app niet in productie.
- Productie-database: tabellen `user`, `session`, `account`, `verification`, `sites`, `pages`, `customers`, `platform_settings`, `media`, `site_versions` en de
  kolommen `sites.published_version`, `sites.layout`, `pages.seo_title`, `pages.seo_description`, `pages.og_image`, `pages.noindex` moeten
  bestaan (geen migratiebestanden; zie §6). Gebruik `drizzle-kit export --sql` als naslag. `platform_settings` is lokaal al
  aangemaakt (dezelfde Neon-database); staat productie op een andere database, maak hem dan daar aan met de DDL uit
  `drizzle-kit export --sql` (`CREATE TABLE "platform_settings"` + de foreign key naar `user`). Zonder de tabel werkt de app nog
  wel (standaardwaarden), maar opslaan onder Instellingen → Algemeen mislukt met een melding. Ook `media` is lokaal met
  handgeschreven SQL aangemaakt (DDL: `drizzle-kit export --sql`); zonder die tabel mislukken uploaden en de bibliotheek.
  Beelden die vóór de bibliotheek in R2 zijn gezet hebben geen rij en zijn onvindbaar in de bibliotheek totdat je er een
  aanmaakt (bestandsnaam leeg, afmetingen uit het beeld zelf).
- Openbare sites in productie: `PLATFORM_HOSTS` (de host(s) van het beheer) en `PREVIEW_DOMAIN` (voorbeeldadressen) instellen; zonder `PLATFORM_HOSTS` wordt nooit een
  openbare site getoond. `site_versions`, `sites.published_version` en `site_domains` moeten bestaan (DDL: `drizzle-kit export --sql`); zonder die tabellen mislukt publiceren of het
  beheren van domeinen.
- Eigen domeinen: `PLATFORM_VERCEL_TOKEN` (token met rechten op het project; de naam mag niet met `VERCEL_` beginnen, dat weigert Vercel) en, bij een team, `PLATFORM_VERCEL_TEAM_ID` instellen in Vercel; het project-id komt automatisch uit `VERCEL_PROJECT_ID`; controleer daarna Instellingen → Koppelingen.
  `PLATFORM_VERCEL_API_URL` werkt alleen buiten productie (testadres) en hoort daar niet gezet te worden.
- R2 in productie: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`, `R2_PUBLIC_URL` als omgevingsvariabelen
  (zie `.env.example`). Controleer daarna Instellingen → Koppelingen. CORS is niet nodig (uploads lopen via de server).
- Een admin aanmaken met `npm run create-user` (tegen de productie-database) is gedaan: het bestaande account staat in de `production`-branch (gekopieerd bij het aanmaken van de branch).

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

**Al bewezen in productie (21 september 2026):** inloggen op `platform.ronklarenmedia.nl`; Koppelingen (Neon, R2 met openbare URL, Vercel) op "Verbonden"; publiceren en de site op `<sitenaam>.rkmsites.dev` (noindex, beelden van
`media.rkmassets.com`, ~7 KB HTML gzip); de beheerroutes (`/login`, `/api/auth/*`) geven op openbare hosts een 404; een eigen domein toevoegen, activeren, primair maken, doorverwijzen, sitemap/robots, en weer
verwijderen; een gepubliceerde wijziging verschijnt direct. Wat hieronder staat is de lijst voor lokaal testen en herhalen.

- Inloggen, uitloggen, en dat je zonder login naar `/login` wordt gestuurd.
- Klantpagina: websites zichtbaar; een klant met websites laat zich niet verwijderen.
- Builder: header en footer toevoegen via "Op alle pagina's"; ze verschijnen in het canvas, klikken erop schakelt
  naar die plek; ongedaan maken per plek.
- Tab "Pagina": SEO opslaan; een bestaande URL wordt geweigerd; het voorbeeld toont de juiste titel en header/footer.
- Menulinks in de header: kiezen uit de pagina's van de site.
- Builder: bij een sectie met een afbeelding (bijv. hero) op "Afbeelding uploaden" klikken met een foto; het voorbeeld verschijnt,
  het canvas toont het beeld, en in de netwerktab komt het van `media.<domein>` als `.webp` met een `srcset`. Probeer ook een
  PDF/SVG (moet geweigerd worden met een melding) en een foto van > 3 MB (wordt eerst in de browser verkleind).
- Bibliotheek: upload een beeld, open "Kies uit bibliotheek", kies een ander beeld (het veld verandert en de alt-melding
  verschijnt); verwijderen is uitgeschakeld voor een beeld in gebruik en werkt voor een ongebruikt beeld (de bestanden zijn dan
  ook uit R2 weg).
- Instellingen → Koppelingen: Neon en Cloudflare R2 staan op "Verbonden" (R2 met "openbare URL bereikbaar"); zet tijdelijk een
  verkeerde `R2_BUCKET` in `.env.local` en zie de melding "Storing".
- Publiceren: klik "Publiceren" (Live · v1), wijzig iets ("Niet-gepubliceerde wijzigingen" verschijnt en bezoekers zien nog de oude tekst), publiceer opnieuw
  (v2), open "Versies" en zet v1 weer live. Bekijk de site op `http://<sitenaam>.localhost:3000` (met `PLATFORM_HOSTS` en `PREVIEW_DOMAIN` op `localhost:3000`
  in `.env.local`); "Op concept zetten" geeft daar een 404.
- Domeinen (na het instellen van de Vercel-variabelen): voeg in de builder onder "Domeinen" `klant.nl` toe; het scherm toont de DNS-records; na het instellen bij de registrar en "Controleer nu"
  wordt het *Actief*. Voeg ook `www.klant.nl` toe en zet één van de twee primair: het andere adres stuurt (308) naar het primaire, `robots.txt` en `sitemap.xml` staan onder het eigen domein.
  Lokaal zonder Vercel is te testen met `curl -H "Host: klant.nl" http://localhost:3000/` nadat het domein in de database staat.
