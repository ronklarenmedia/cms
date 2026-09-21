-- Favicon per site (21 september 2026): één optionele kolom op sites. Alleen additief; bestaande sites blijven ongewijzigd (leeg = automatisch icoon).
-- Eerst op de lokale branch (main), daarna op production, vóór het deployen van de code die de kolom leest.
-- Verwachte DDL ter controle: node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql
BEGIN;

ALTER TABLE "sites" ADD COLUMN "favicon_url" text;

COMMIT;
