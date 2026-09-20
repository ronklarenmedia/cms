import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import type { SectionData } from "@/blocks/contract";
import type { SiteTheme } from "@/blocks/theme";

export const customerTierEnum = pgEnum("customer_tier", ["bojob", "pro"]);
export const customerStatusEnum = pgEnum("customer_status", ["active", "inactive"]);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  tier: customerTierEnum("tier").notNull().default("bojob"),
  status: customerStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Inloggen (Better Auth) ────────────────────────────────────────────────────
// Veldnamen volgen het kernschema van Better Auth; `role` en `customerId` zijn eigen uitbreidingen.
export const userRoles = ["platform-admin", "medewerker", "klantgebruiker"] as const;
export type UserRole = (typeof userRoles)[number];

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    // platform-admin en medewerker beheren het platform; een klantgebruiker hoort bij één klant (portal volgt later).
    role: varchar("role", { length: 32 }).$type<UserRole>().notNull().default("medewerker"),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("user_role_check", sql`${t.role} in ('platform-admin', 'medewerker', 'klantgebruiker')`)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

/** Sitebrede secties die op elke pagina staan (zie src/app/websites/layout-slots.ts). */
export type SiteLayout = { header: SectionData[]; footer: SectionData[] };

export const siteStatusEnum = pgEnum("site_status", ["draft", "live"]);

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  // Overrides op de `defaultTheme`-tokens (zie src/blocks/theme.ts).
  theme: jsonb("theme").$type<SiteTheme>().notNull().default({}),
  layout: jsonb("layout").$type<SiteLayout>().notNull().default({ header: [], footer: [] }),
  status: siteStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    // Pad binnen de site zonder slashes; de homepagina heeft een lege slug.
    slug: varchar("slug", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    position: integer("position").notNull().default(0),
    // Lijst secties, zie src/blocks/README.md ("Hoe een sectie wordt opgeslagen").
    content: jsonb("content").$type<SectionData[]>().notNull().default([]),
    // SEO: leeg = terugvallen op de paginatitel. Zie src/app/websites/seo.ts.
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: varchar("seo_description", { length: 400 }),
    ogImage: text("og_image"),
    noindex: boolean("noindex").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("pages_site_slug_unique").on(t.siteId, t.slug)],
);

// Platformbrede instellingen (Instellingen → Algemeen). Eén rij: de CHECK dwingt id = 1 af.
// Ontbreekt de rij, dan gelden de standaardwaarden uit src/lib/platform-settings.ts.
export const platformSettings = pgTable(
  "platform_settings",
  {
    id: integer("id").primaryKey().default(1),
    platformName: varchar("platform_name", { length: 120 }).notNull().default("Ron Klaren Media"),
    adminDomain: varchar("admin_domain", { length: 255 }),
    language: varchar("language", { length: 8 }).notNull().default("nl"),
    timezone: varchar("timezone", { length: 64 }).notNull().default("Europe/Amsterdam"),
    supportEmail: varchar("support_email", { length: 255 }),
    senderName: varchar("sender_name", { length: 120 }),
    phone: varchar("phone", { length: 50 }),
    kvk: varchar("kvk", { length: 20 }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
  },
  (t) => [check("platform_settings_singleton", sql`${t.id} = 1`)],
);

// Mediabibliotheek: één rij per geüploade afbeelding van een website. `id` is ook de mapnaam in R2
// (`sites/<siteId>/<id>/<breedte>.webp`), zodat de bestanden bij de rij te vinden zijn. Zie src/lib/media.ts.
export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    // Openbare URL van de grootste variant en de `srcset` met alle varianten.
    url: text("url").notNull(),
    srcset: text("srcset").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    // Naam van het geüploade bestand; leeg bij beelden die vóór de bibliotheek zijn geüpload.
    filename: varchar("filename", { length: 255 }),
    // Totale grootte van alle varianten in de opslag.
    bytes: integer("bytes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
  },
  (t) => [index("media_site_created_idx").on(t.siteId, t.createdAt)],
);

export type Site = typeof sites.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
export type PlatformSettingsRow = typeof platformSettings.$inferSelect;
export type Page = typeof pages.$inferSelect;
