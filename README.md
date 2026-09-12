# cms-platform

Multi-tenant block-based CMS/website-builder platform. Zie het architectuurdocument voor de volledige achtergrond (niveauhiërarchie, hosting, prijsstrategie, roadmap).

## Structuur

- `apps/cms` — Payload CMS (Next.js + Postgres), de ene centrale admin-instantie voor alle klanten
- `apps/site` — Astro, dezelfde codebase voor elke klantsite (per site apart gebouwd en gedeployed)
- `packages/shared-types` — gedeelde TypeScript-types tussen `cms` en `site` (nog leeg)

## Status

Eerste werkende scaffold: beide apps installeren en builden. Nog te doen (zie ook §11 "Openstaande punten" in het architectuurdocument):

- Live Postgres-database aansluiten (Railway/Neon) i.p.v. de placeholder-connectiestring
- Cloudflare R2 koppelen aan de `media`-collectie (S3-adapter, zie `apps/cms/payload.config.ts`)
- Resterende v1-bouwblokken toevoegen (nu alleen Hero en Foto+Tekst als voorbeeld)
- `apps/site` echt laten ophalen bij de Payload API (nu een statische placeholder-pagina)
- Preview-route (SSR) op `apps/site` voor Live Preview vanuit Payload

## Ontwikkelen

```bash
pnpm install

# Payload CMS — vereist DATABASE_URI + PAYLOAD_SECRET, zie apps/cms/.env.example
pnpm dev:cms

# Astro-site — vereist SITE_ID + PAYLOAD_API_URL, zie apps/site/.env.example
pnpm dev:site
```
