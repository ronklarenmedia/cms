# Eerste deploy op Vercel

Stap voor stap, in deze volgorde. Stand: 20 september 2026. Achtergrond en keuzes: `docs/hosting-opties.md`. De lijst met variabelen staat ook in `.env.example`.

## Vooraf (klaar)
- Vercel **Pro** op het account (geen apart team nodig; laat `VERCEL_TEAM_ID` dan leeg).
- Domein voor voorbeeldadressen: **`rkmsites.dev`**, met de Vercel-nameservers (`ns1/ns2.vercel-dns.com`).
- `vercel.json` in de repo zet de functieregio op **`fra1`** (Frankfurt, dicht bij Neon `eu-central-1`). Zonder dit draait Vercel in Washington en wordt elke databasequery traag.

## Besloten
1. **Productiedatabase: een aparte Neon-branch `production`**, een kopie van `main` (schema en testgegevens inbegrepen). Lokaal blijft op `main` draaien, productie op `production`.
   - **Aangemaakt** op 20 september 2026 met de Neon-CLI: project `rkm-platform` (`flat-unit-34665691`, Frankfurt), branch `production` (`br-cold-silence-b16vg4l5`), kopie van `main` met alle tabellen en je gebruiker. De lokale sessies zijn op `production` weggehaald, dus in productie moet je opnieuw inloggen.
   - De **gepoolde** verbindingsstring komt als `DATABASE_URL` in Vercel; de string uit `.env` blijft lokaal. Kopieer hem zonder hem te tonen (macOS): `npx neon@latest connection-string production --project-id flat-unit-34665691 --pooled | pbcopy`.
   - **Schemawijzigingen** (handgeschreven SQL, zie `docs/STATUS.md` §6) draai je vanaf nu op **beide** branches: eerst op `main`, dan op `production`, en pas daarna deployen. Anders loopt productie uit de pas met de code.
   - Staat de branch op scale-to-zero, dan is de eerste beheerpagina na stilte iets trager. Openbare sites merken dat niet: ze komen uit de cache.
2. **Beheeradres: eerst het `*.vercel.app`-adres, daarna `platform.ronklarenmedia.nl`** (dus niet onder `rkmsites.dev`).
   - **Bij Strato** (Domeinen → DNS/nameserverinstellingen van `ronklarenmedia.nl`): één **CNAME-record** voor `platform` naar `cname.vercel-dns.com`, of de waarde die Vercel toont zodra je het domein aan het project toevoegt. Maak het als DNS-record en niet als Strato-"subdomein" (dat wijst naar hun eigen hosting). Je website en mail (MX) blijven ongemoeid.
   - **In Vercel**: domein `platform.ronklarenmedia.nl` toevoegen aan het project. Wacht tot het "Valid Configuration" toont.
   - **Daarna** `PLATFORM_HOSTS` op `*.vercel.app,platform.ronklarenmedia.nl` en `BETTER_AUTH_URL` op `https://platform.ronklarenmedia.nl` zetten en opnieuw deployen.

## 1. Project aanmaken
Vercel → **Add New… → Project** → repo `ronklarenmedia/cms` importeren (GitHub-koppeling goedkeuren). Framework wordt vanzelf **Next.js**. **Klik nog niet op Deploy**: zonder `BETTER_AUTH_SECRET` start de app niet in productie.

## 2. Omgevingsvariabelen (Project → Settings → Environment Variables, alleen "Production")
| Naam | Waarde |
|---|---|
| `DATABASE_URL` | gepoolde verbindingsstring van de Neon-branch `production` (niet die van `main`) |
| `BETTER_AUTH_SECRET` | nieuw en geheim: `openssl rand -base64 32` (niet hergebruiken uit een andere omgeving) |
| `BETTER_AUTH_URL` | het beheeradres, bijv. `https://<project>.vercel.app`; later het eigen beheeradres |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET`, `R2_PUBLIC_URL` | zoals in `.env.local` (`R2_PUBLIC_URL=https://media.rkmassets.com`) |
| `PLATFORM_HOSTS` | `*.vercel.app` (later erbij: het eigen beheeradres). **Vergeet dit niet**: wat hier niet in staat, wordt als openbare site behandeld en het beheer zou dan een 404 geven |
| `PREVIEW_DOMAIN` | `rkmsites.dev` |
| `VERCEL_TOKEN` | Account Settings → Tokens → nieuw token voor dit doel |
| `VERCEL_PROJECT_ID` | Project → Settings → General → Project ID |
| `VERCEL_TEAM_ID` | leeg laten bij een persoonlijk account; anders `team_…` |

Zet `VERCEL_API_URL` **niet**: die werkt alleen buiten productie en is bedoeld voor tests.

## 3. Deployen en controleren
1. Deploy. Open het `*.vercel.app`-adres en log in met je bestaande account (de gebruikers staan in de database).
2. Instellingen → Koppelingen: **Neon**, **Cloudflare R2** en **Vercel** moeten "Verbonden" zijn.
3. Controleer in Vercel (Settings → Functions) dat de regio Frankfurt is.

## 4. Domeinen koppelen
1. Project → Settings → Domains: voeg **`rkmsites.dev`** en **`*.rkmsites.dev`** toe (het wildcard kan omdat de nameservers bij Vercel staan).
2. Publiceer een site in de builder: hij staat dan op `https://<sitenaam>.rkmsites.dev` (met `noindex`).
3. Beheeradres op een eigen domein: domein toevoegen in het project, dan `PLATFORM_HOSTS` en `BETTER_AUTH_URL` bijwerken en opnieuw deployen. Houd `*.vercel.app` in `PLATFORM_HOSTS`.
4. Eigen domeinen van klanten: via de knop **Domeinen** in de builder; de app meldt ze zelf aan bij Vercel.

## Let op
- Alles op `*.rkmsites.dev` behalve wat je zelf aanmaakt, is een klantsite: zet het beheer daar dus nooit onder.
- `.dev`-domeinen werken alleen via https; Vercel regelt het certificaat vanzelf.
- Wijzigingen aan de database (nieuwe tabellen) eerst op de productiebranch toepassen, daarna deployen.
