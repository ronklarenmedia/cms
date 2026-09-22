-- Zelf gehoste Google Fonts (22 september 2026): tabel hosted_fonts. Platformbreed (geen site_id): een familie wordt maar één
-- keer opgehaald, ongeacht welke site of kit hem als eerste kiest (zie src/lib/google-fonts.ts). Alleen additief.
-- Eerst op de lokale branch (main) uitvoeren, daarna op production, vóór het deployen van de code die de tabel leest.
-- Verwachte DDL ter controle: node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql
BEGIN;

CREATE TYPE "public"."font_category" AS ENUM('sans', 'serif', 'mono', 'display', 'handwriting');

CREATE TABLE "hosted_fonts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"family" varchar(120) NOT NULL,
	"category" "font_category" NOT NULL,
	"files" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text
);

ALTER TABLE "hosted_fonts" ADD CONSTRAINT "hosted_fonts_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
CREATE UNIQUE INDEX "hosted_fonts_family_idx" ON "hosted_fonts" USING btree (lower("family"));

COMMIT;
