# Hosting van klantsites — opties en advies

Doel van dit document: de keuze uit `docs/STATUS.md` §8 ("Hosting van klantsites") voorbereiden. Stand: 20 september 2026.
Prijzen komen uit de documentatie van Vercel en Cloudflare (bronnen onderaan); de verkeersaannames zijn van mij en staan erbij.

## 1. Uitgangspunten

- **Noordster:** supersnelle, goed vindbare websites (ook voor AI-assistenten).
- **Schaal** (uit het plan): nu 5–10 sites, 100–150 binnen een jaar, stretch-doel 1000+.
- **Elke klant een eigen domein.** Ron regelt DNS standaard; een klant mag het ook zelf (tegen een kleine vergoeding).
- **Wat er al is:** één Next.js 16-app (beheer + voorbeeld), Neon Postgres (Frankfurt), R2 voor beelden. De blocks zijn server components
  zonder client-JS, dus de HTML van een pagina is vrijwel statisch.
- **Wat er nog niet is:** het echt publiceren. "Publiceren" zet nu alleen een status.

## 2. Wat er bij élke optie moet gebeuren

Los van waar het draait, ontbreekt er een openbaar renderpad. Vier dingen zijn onvermijdelijk:

1. **Aparte lay-out voor openbare sites.** De root-layout leest nu de sessie en de platforminstellingen, waardoor elke pagina dynamisch is,
   en `src/proxy.ts` stuurt iedereen zonder sessiecookie naar `/login`. Openbare sites krijgen een eigen routegroep met eigen root-layout
   zonder sessie, en de proxy laat die hosts door.
2. **Host → site.** Een tabel met domeinen per site (bijv. `site_domains`: hostnaam uniek, status, geverifieerd op, primair) en een opzoeking
   op de `Host`-header.
3. **Publiceren als momentopname.** Nu is `pages.content` de werkkopie: elke autosave zou direct live gaan. Publiceren moet een vaste versie
   vastleggen (de backlog noemt dit al: "snapshot bij publiceren", ook voor terugrollen).
4. **Zoekmachine-onderdelen per domein:** `sitemap.xml`, `robots.txt`, canonical-URL, 404-pagina, www ↔ kale domein-redirect, absolute URL's in JSON-LD
   en `og:image` (bekend punt bij `team` en `breadcrumbs`).

## 3. De opties

### A. Eén multi-tenant Next.js-app op Vercel (aanbevolen)

Eén codebase en één deployment bedient alle sites; de host bepaalt welke site getoond wordt. Dit is ook het patroon dat Vercel en Next.js zelf
voor websitebouwers beschrijven.

- **Domeinen:** worden via de Vercel-API toegevoegd en gecontroleerd; SSL wordt automatisch uitgegeven en vernieuwd. Op Pro geldt "onbeperkt" aantal
  eigen domeinen (zachte limiet 100.000 per project). Domeinen toevoegen: 100 per uur per team, controleren: 50 per uur.
- **Kale domeinen** (`klant.nl`) werken met een gewoon A-record; `www` met een CNAME. Vercel toont per domein welke records nodig zijn.
- **Wildcard-subdomeinen** (`*.jouwplatform.nl`, voor voorbeeldadressen) vragen dat het platformdomein de Vercel-nameservers gebruikt.
- **Snelheid:** pagina's als ISR met `revalidateTag` per site bij publiceren; bezoekers krijgen dan gecachete HTML van de CDN.
  Functieregio kiezen bij Neon (Frankfurt: `fra1`).
- **Kosten:** Pro is $20 per maand en bevat $20 verbruikstegoed, 1 betaalde plek en de kleinste CDN-laag (1 miljoen requests, 1 TB).
  Grotere lagen: $20 per maand (10 miljoen requests), $100 (50 miljoen), $300 (150 miljoen). Extra plekken $20. Beelden lopen via R2 en tellen niet mee.
- **Voordelen:** kleinste stap vanaf nu (zelfde code, zelfde database), automatische SSL, previews en terugrollen van deployments.
- **Nadelen:** vaste leverancier; kosten schalen met requests; elke pagina levert nog de React-runtime mee, tenzij dat later wordt weggehaald.
- **Werk:** de vier punten uit §2, plus Instellingen → Domeinen (toevoegen, DNS-records tonen, status), `VERCEL_TOKEN`/project-id in Koppelingen.

### B. Zelf hosten (VPS + Docker/Coolify + Caddy)

Next.js heeft alleen een Node-server nodig. Caddy kan certificaten voor klantdomeinen automatisch aanvragen.

- **Kosten:** het laagst en vast (enkele euro's tot tientallen per maand).
- **Nadelen:** beheer ligt bij Ron (updates, back-ups, uptime, één regio, geen CDN tenzij je Cloudflare ervoor zet). Past minder bij één persoon die ook
  klanten bedient. Alleen aantrekkelijk als kosten of controle zwaar gaan wegen.

### C. Statische publicatie: HTML in R2, geserveerd door een Cloudflare Worker

Publiceren maakt een momentopname van elke pagina (HTML + CSS) en zet die onder een onveranderlijke versiemap in R2. Een kleine Worker zoekt
op de host de site en versie op en serveert het bestand. Klantdomeinen via Cloudflare for SaaS.

- **Snelheid en kosten:** sneller dan A (geen server, geen cache-miss), en zonder uitgaand verkeer. Workers Paid is $5 per maand met 10 miljoen requests inbegrepen,
  daarna $0,30 per miljoen. Terugrollen is vanzelf: de vorige versiemap blijft staan.
- **Domeinen:** Cloudflare for SaaS rekent per klantdomein: de eerste 100 zijn gratis, daarna $0,10 per domein per maand (tot 50.000); SSL zit erin.
- **Kale domeinen zijn het struikelpunt.** Een klant met `klant.nl` (zonder www) heeft bij Cloudflare for SaaS een DNS-aanbieder nodig die een CNAME op het kale domein
  toestaat, of "apex proxying" (A-records met vaste IP's), dat alleen voor bepaalde klanten beschikbaar is en waarvoor je contact opneemt met Cloudflare.
  Veel Nederlandse hostingpakketten kunnen dat niet. Alleen als Ron de nameservers van de klant naar Cloudflare zet, is het opgelost, maar dat is een zone per klant.
- **Werk:** het meeste van de vier opties: een publicatiestraat (de bestaande app rendert de pagina, de opslag pakt het resultaat en de CSS), een Worker als tweede
  codebase, formulieren en andere dynamiek via een eigen eindpunt. Ook nog uit te zoeken: of het weghalen van de React-runtime uit de HTML veilig kan (dat zou de snelste
  pagina's opleveren).

### D. Heel Next.js op Cloudflare Workers (OpenNext-adapter)

Eén leverancier voor alles, maar voor deze app een risico: de adapter heeft bekende problemen met de Next 16-`proxy` (die altijd op Node draait), en `sharp`, dat de uploads
verwerkt, is een Node-onderdeel dat, voor zover ik weet, niet op Workers draait. Niet aanbevolen; als Cloudflare gewenst is, dan alleen zoals in C.

### E. Een Vercel-project per klant (multi-project)

Bedoeld voor platformen waar elke klant eigen code heeft. Hier delen alle sites dezelfde code, dus dit voegt beheer en API-limieten toe zonder winst. Niet aanbevolen.

## 4. Kosten bij twee groottes (mijn aannames)

Aannames: 3.000 bezoeken per site per maand, 3 paginaweergaven per bezoek, 5 requests per paginaweergave voor A (HTML, CSS, JS; beelden komen van R2) en 3 voor C.

| | 150 sites | 1000 sites |
|---|---|---|
| **A. Vercel** | ca. 6,8 miljoen requests: Pro $20 + laag $20 = **ca. $40 per maand** + kleine rekenkosten | ca. 45 miljoen requests: Pro $20 + laag $100 = **ca. $120 per maand** + rekenkosten |
| **C. Cloudflare** | ca. 4 miljoen Worker-requests + 50 extra domeinen = **ca. $10 per maand** | ca. 27 miljoen requests + 900 extra domeinen = **ca. $100 per maand** |

Conclusie uit de cijfers: **de kosten beslissen dit niet.** Op 150 sites scheelt het ongeveer $30 per maand; op 1000 sites eet de prijs per domein bij Cloudflare het voordeel op.
Wat wél telt: hoeveel werk het is, hoe kale domeinen werken en hoe snel de pagina's zijn.

## 5. Advies

**Begin met A.** Het is de kleinste stap, de code en de database blijven dezelfde, en kale domeinen werken met een gewoon A-record. Bouw het openbare renderpad zo dat het
uitsluitend HTML uit server components levert, zodat je later kunt overstappen naar C (momentopname in R2) zonder de blocks aan te passen.

**Wisselmomenten om naar C te kijken:** de Vercel-rekening komt structureel boven ca. $100 per maand, de gemeten laadtijd haalt het doel niet, of je wilt het terugrollen per site
volledig onafhankelijk van deployments.

**Gemeten bij A (lokaal, productiebouw):** een openbare pagina is 39 KB HTML (7 KB gzip), 6 KB gzip CSS en ~174 KB gzip JavaScript (567 KB onverpakt), terwijl geen enkel block
interactief is. Uit cache komt hij in 2–3 ms (eerste bouw 250 ms). Het JavaScript is de Next-runtime en de grootste post op weg naar "supersnel".

**JS-loze pagina's zijn haalbaar** (getest): `react-dom/server` mag niet in een routehandler (bouwfout), maar `react-dom/static` (`prerender`) wel, en levert HTML zonder één script
(1 KB voor een hero). Een openbare pagina als routehandler die HTML teruggeeft haalt dus alle JavaScript weg. Wat dat kost: de `<head>` (titel, omschrijving, canonical, Open Graph,
robots) zelf schrijven in plaats van Next-metadata, en de caching zelf regelen (`Cache-Control` voor de CDN plus het ongeldig maken bij publiceren). Dit is ook het eerste bruikbare deel van optie C,
zonder tweede leverancier. Aanbeveling: eerst de eigen domeinen bouwen, daarna dit als aparte stap uitproberen en meten.

**Nog uit te zoeken bij A:** hoe snel een gepubliceerde wijziging wereldwijd zichtbaar is (revalidatie op Vercel).

## 6. Besluiten en open punten

1. **Start met A: ja.** Ron maakt een Vercel Pro-team aan.
2. **DNS van klantdomeinen: de klant bepaalt.** (Gebouwd: de knop "Domeinen" in de builder, zie `docs/STATUS.md` §3.) Twee routes, beide moeten kunnen: Ron regelt het (met toegang bij de registrar van de klant) of de klant zet
   de records zelf. Instellingen → Domeinen toont daarom per domein de benodigde DNS-records en de status, zodat het ook als instructie aan een klant kan.
3. **Voorbeeldadressen: ja, op een apart domein** (advies, wacht op akkoord). Niet `rkmassets.com`:
   - Wildcard-subdomeinen vragen dat het hele domein de Vercel-nameservers gebruikt. `rkmassets.com` staat bij Cloudflare, met `media.` aan de R2-bucket gekoppeld;
     beide kan niet tegelijk.
   - Media en klantsites horen niet onder één domein: één misbruikte klantsite schaadt de reputatie van al het andere, en cookies en beveiliging delen dan hun grens.
   - Neem een extensie met een goede naam (`.nl`, `.com`, of `.app`/`.dev`), geen `.download`/`.stream` (zie `docs/STATUS.md` §5). Een Vercel Pro-team bevat een gratis eerste jaar
     voor `.app` en `.dev` en regelt de DNS dan vanzelf.
   - Zodra een klant een eigen domein koppelt, moet het voorbeeldadres doorverwijzen of `noindex` krijgen, anders staat dezelfde site twee keer in Google.
4. **Publiceren als momentopname: ja** (advies, wacht op akkoord). Ontwerp:
   - Nieuwe tabel `site_versions`: `id`, `site_id`, `version` (oplopend per site), `snapshot` (jsonb met thema, header/footer en alle pagina's), `created_at`, `created_by`, optionele `note`.
     `sites.published_version` (het versienummer) wijst naar de live versie. Eén rij per publicatie, dus openbaar renderen leest één rij per site.
   - Publiceren valideert alle secties, kopieert de werkkopie naar een nieuwe versie en maakt de cache van die site ongeldig (`revalidateTag`).
   - Terugrollen = het laten wijzen naar een oudere versie. **Gebouwd** (20 september 2026, zie `docs/STATUS.md` §3). De builder toont "Niet-gepubliceerde wijzigingen" naast de status.
   - Bewaar de laatste 20 versies per site; oudere worden opgeruimd (opslag in Neon).
   - Dit is een schemawijziging in de gedeelde database: eerst goedkeuring, dan additieve SQL in een transactie (geen `drizzle-kit push`).

## Bronnen

- Vercel: [Vercel for Platforms](https://vercel.com/docs/platforms), [multi-tenant limieten](https://vercel.com/docs/platforms/multi-tenant-platforms/limits), [Pro-plan](https://vercel.com/docs/plans/pro-plan),
  [Flat Rate CDN](https://vercel.com/docs/pricing/flat-rate-cdn), [prijzen per regio](https://vercel.com/docs/pricing/regional-pricing)
- Cloudflare: [Workers-prijzen](https://developers.cloudflare.com/workers/platform/pricing/), [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/),
  [apex proxying](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/apex-proxying/)
- OpenNext op Workers: [Cloudflare-documentatie](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), [bekend probleem met Next 16 proxy](https://github.com/cloudflare/workers-sdk/issues/13755)
- Next.js (lokale docs): `node_modules/next/dist/docs/01-app/02-guides/{multi-tenant,deploying-to-platforms,incremental-static-regeneration,self-hosting}.md`
