import { integer, jsonb, pgEnum, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
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

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("pages_site_slug_unique").on(t.siteId, t.slug)],
);

export type Site = typeof sites.$inferSelect;
export type Page = typeof pages.$inferSelect;
