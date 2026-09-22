-- Versiebeheer van design kits (22 september 2026): tabel design_kit_versions. Elke "Opslaan" in de kit-editor legt de
-- vorige stand vast vóór de nieuwe waarden worden weggeschreven; er is geen apart publiceren voor kits, een wijziging
-- werkt meteen door. Alleen additief.
-- Eerst op de lokale branch (main) uitvoeren, daarna op production, vóór het deployen van de code die de tabel leest.
-- Verwachte DDL ter controle: node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql
BEGIN;

CREATE TABLE "design_kit_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kit_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"theme" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	CONSTRAINT "design_kit_versions_kit_version_unique" UNIQUE("kit_id","version")
);

ALTER TABLE "design_kit_versions" ADD CONSTRAINT "design_kit_versions_kit_id_design_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."design_kits"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "design_kit_versions" ADD CONSTRAINT "design_kit_versions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;

COMMIT;
