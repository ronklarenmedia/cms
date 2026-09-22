# Ron Klaren Media — platform

Multi-tenant platform om websites (en later apps) voor klanten te bouwen en te beheren. Websites worden opgebouwd
uit **blocks** (herbruikbare secties in code) met **thema-tokens**; noordster is supersnelle, goed vindbare sites
(ook voor AI-assistenten), geen visuele originaliteit per site. Openbare sites zijn pure HTML zonder JavaScript.

**Lees eerst [`docs/STATUS.md`](docs/STATUS.md).** Dat is het levende overdrachtsdocument: productiestand, wat
werkt, architectuur, genomen beslissingen, bekende valkuilen en de checklist voor deployen. Dit bestand is alleen
een korte start.

## Snel starten

```bash
npm install
```

Maak `.env.local` (staat niet in git) met minimaal `DATABASE_URL` (Neon) en `BETTER_AUTH_SECRET`; zie
`docs/STATUS.md` §2 voor de volledige lijst en waar je de waarden vandaan haalt. Daarna:

```bash
npm run dev            # http://localhost:3000
```

Inloggen met een bestaand account, of maak er een aan met `npm run create-user` (vraagt om een wachtwoord in de
terminal).

## Stack

Next.js 16 (App Router), React 19, Tailwind 4, Drizzle ORM + Neon Postgres, Zod 4, Better Auth, Cloudflare R2.

**Dit is niet de Next.js uit je hoofd:** zie [`AGENTS.md`](AGENTS.md) — belangrijke API's zijn anders dan je
training data (bijv. `proxy.ts` in plaats van `middleware.ts`).

## Belangrijke commando's

```bash
npm run dev                # ontwikkelserver
npm run check:blocks       # controleert alle blocks tegen het contract
npm run build              # productiebuild (vangt ook type- en lintfouten)
npm run create-user        # gebruiker aanmaken of wachtwoord opnieuw instellen (in een terminal)
npx tsc --noEmit            # typecontrole
npx eslint src scripts      # linten
```

## Structuur

```
src/app/(beheer)/   het beheer (klanten, websites, instellingen, componenten, login, …)
src/app/(sites)/    openbare sites: alleen route-handlers, pure HTML, geen React in de browser
src/blocks/         het block-systeem (contract, registry, 20 blocks, README.md)
src/db/             Drizzle-schema en verbinding
src/lib/            gedeelde server- en clientlogica
docs/               STATUS.md (overdracht), hosting-opties.md, deploy-vercel.md, sql/ (handgeschreven migraties)
```

Voor het bouwen of aanpassen van een block: zie [`src/blocks/README.md`](src/blocks/README.md).

## Werkafspraken

Nederlands voor interface, commentaar en commitberichten. Databasewijzigingen zijn handgeschreven, additieve SQL in
`docs/sql/` (geen migratieraamwerk, nooit `drizzle-kit push`) — zie `docs/STATUS.md` §6 voor waarom. Vóór een
commit: `npx tsc --noEmit`, `npx eslint src scripts`, `npm run check:blocks`, `npm run build`.
