-- Design kits (21 september 2026): tabel design_kits, kolom sites.design_kit_id en twee platformkits.
-- Alleen additief, in één transactie; bestaande sites blijven ongewijzigd (design_kit_id blijft leeg). Eerst op de lokale
-- branch (main) uitvoeren, daarna op production, vóór het deployen van de code die de tabel leest.
-- Verwachte DDL ter controle: node --env-file=.env.local node_modules/.bin/drizzle-kit export --sql
BEGIN;

CREATE TABLE "design_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"customer_id" uuid,
	"theme" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text
);

ALTER TABLE "design_kits" ADD CONSTRAINT "design_kits_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "design_kits" ADD CONSTRAINT "design_kits_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX "design_kits_customer_idx" ON "design_kits" USING btree ("customer_id");

ALTER TABLE "sites" ADD COLUMN "design_kit_id" uuid;
ALTER TABLE "sites" ADD CONSTRAINT "sites_design_kit_id_design_kits_id_fk" FOREIGN KEY ("design_kit_id") REFERENCES "public"."design_kits"("id") ON DELETE restrict ON UPDATE no action;

-- Platformkits (klant leeg), gelijk aan de voorbeeldthema's in src/blocks/theme.ts.
INSERT INTO "design_kits" ("name", "customer_id", "theme") VALUES ('Corporate', NULL, '{}'::jsonb);
INSERT INTO "design_kits" ("name", "customer_id", "theme") VALUES ('Warm', NULL, '{"colorPrimary":"#c2410c","colorSecondary":"#ea580c","colorAccent":"#0f766e","colorText":"#292524","colorBgPrimaryLight":"#fff7ed","colorBgPrimaryMedium":"#fed7aa","colorBgPrimaryDark":"#9a3412","colorBgSecondaryLight":"#f0fdfa","colorBgSecondaryMedium":"#99f6e4","colorBgSecondaryDark":"#115e59","colorOffWhite":"#fafaf9","colorLightGrey":"#e7e5e4","fontFamilyPrimary":"Georgia, \"Times New Roman\", serif","borderRadiusStandard":"0.25rem","borderRadiusMedium":"0.375rem","borderRadiusLarge":"0.5rem"}'::jsonb);

COMMIT;
