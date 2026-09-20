"use server";

import { asc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { customers, designKits, pages, sites } from "@/db/schema";
import { MAX_QUERY, MIN_QUERY, type SearchGroup, type SearchResult } from "@/lib/search-types";
import { staffUser } from "@/lib/session";

// Zoeken in het beheer: klanten, websites, pagina's en design kits. Een server-actie, dus een openbaar eindpunt: de sessie wordt
// zelf gecontroleerd. Bewust simpel (ILIKE); bij veel meer gegevens hoort er een trigram-index bij (pg_trgm).

const PER_GROUP = 5;

/** Maakt van een zoekterm een LIKE-patroon; `%`, `_` en `\` in de invoer zoeken letterlijk en werken niet als jokerteken. */
const pattern = (q: string) => `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

export async function searchPlatform(raw: string): Promise<SearchResult> {
  if (!(await staffUser())) return { error: "Je bent niet (meer) ingelogd." };
  const query = raw.trim().slice(0, MAX_QUERY);
  if (query.length < MIN_QUERY) return { query, groups: [] };
  const like = pattern(query);

  const [clientRows, siteRows, pageRows, kitRows] = await Promise.all([
    db
      .select({ id: customers.id, name: customers.name, contact: customers.contactName, inactive: customers.status })
      .from(customers)
      .where(or(ilike(customers.name, like), ilike(customers.contactName, like), ilike(customers.email, like)))
      .orderBy(asc(customers.name))
      .limit(PER_GROUP),
    db
      .select({ id: sites.id, name: sites.name, slug: sites.slug, status: sites.status, customer: customers.name })
      .from(sites)
      .innerJoin(customers, eq(customers.id, sites.customerId))
      .where(or(ilike(sites.name, like), ilike(sites.slug, like)))
      .orderBy(asc(sites.name))
      .limit(PER_GROUP),
    db
      .select({ id: pages.id, title: pages.title, slug: pages.slug, siteId: sites.id, site: sites.name })
      .from(pages)
      .innerJoin(sites, eq(sites.id, pages.siteId))
      .where(or(ilike(pages.title, like), ilike(pages.slug, like), ilike(pages.seoTitle, like)))
      .orderBy(asc(sites.name), asc(pages.title))
      .limit(PER_GROUP + 3),
    db
      .select({ id: designKits.id, name: designKits.name, customer: customers.name })
      .from(designKits)
      .leftJoin(customers, eq(customers.id, designKits.customerId))
      .where(ilike(designKits.name, like))
      .orderBy(asc(designKits.name))
      .limit(PER_GROUP),
  ]);

  const groups: SearchGroup[] = [
    {
      key: "klanten",
      label: "Klanten",
      icon: "users-three",
      items: clientRows.map((c) => ({ id: c.id, title: c.name, subtitle: c.inactive === "inactive" ? `${c.contact} · inactief` : c.contact, href: `/klanten/${c.id}` })),
    },
    {
      key: "websites",
      label: "Websites",
      icon: "browsers",
      items: siteRows.map((s) => ({ id: s.id, title: s.name, subtitle: `${s.customer} · ${s.status === "live" ? "live" : "concept"}`, href: `/websites/${s.id}` })),
    },
    {
      key: "paginas",
      label: "Pagina's",
      icon: "file-text",
      // De homepage heeft een lege slug; de builder opent dan op die pagina.
      items: pageRows.map((p) => ({ id: p.id, title: p.title, subtitle: `${p.site} · ${p.slug === "" ? "/" : `/${p.slug}`}`, href: `/websites/${p.siteId}?pagina=${encodeURIComponent(p.slug)}` })),
    },
    {
      key: "kits",
      label: "Design kits",
      icon: "palette",
      items: kitRows.map((k) => ({ id: k.id, title: k.name, subtitle: k.customer ?? "Platformkit", href: `/design-kits/${k.id}` })),
    },
  ];
  return { query, groups: groups.filter((g) => g.items.length > 0) };
}
