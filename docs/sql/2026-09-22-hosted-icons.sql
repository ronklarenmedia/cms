-- Zelf gehoste Material Symbols-iconen (22 september 2026): tabel hosted_icons. Platformbreed, gesaneerde SVG in een
-- tekstkolom (geen R2 nodig). Nu alleen gebruikt door usp-grid (zie src/lib/material-icons.ts). Alleen additief.
-- Eerst op de lokale branch (main) uitvoeren, daarna op production, vóór het deployen van de code die de tabel leest.
-- Verwachte DDL ter controle: node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql
BEGIN;

CREATE TABLE "hosted_icons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(60) NOT NULL,
	"svg" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	CONSTRAINT "hosted_icons_name_unique" UNIQUE("name")
);

ALTER TABLE "hosted_icons" ADD CONSTRAINT "hosted_icons_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;

COMMIT;
