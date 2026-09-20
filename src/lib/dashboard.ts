import { asc, count, desc, eq, max, sql } from "drizzle-orm";
import { db } from "@/db";
import { customers, media, siteDomains, sites, siteVersions, user } from "@/db/schema";
import { getPlatformSettings } from "./platform-settings";

// De gegevens voor het platformoverzicht (/). Alleen op de server. Alles komt uit de database; wat het platform niet meet
// (bezoekers, pageviews) staat hier bewust niet.

/** Perioden voor de activiteitsgrafiek: aantal staafjes en de eenheid waarin ze worden gegroepeerd. */
export const PERIODS = {
  "24u": { label: "24 u", unit: "hour", buckets: 24, title: "afgelopen 24 uur" },
  "7d": { label: "7 d", unit: "day", buckets: 7, title: "afgelopen 7 dagen" },
  "30d": { label: "30 d", unit: "day", buckets: 30, title: "afgelopen 30 dagen" },
} as const;
export type Period = keyof typeof PERIODS;
export const PERIOD_KEYS = Object.keys(PERIODS) as Period[];
export const parsePeriod = (value: string | undefined): Period => (value && value in PERIODS ? (value as Period) : "30d");

const relative = new Intl.RelativeTimeFormat("nl", { numeric: "auto" });
/** "2 minuten geleden", "gisteren", "3 dagen geleden". */
export function timeAgo(date: Date, now = Date.now()): string {
  const seconds = Math.round((date.getTime() - now) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  return "zojuist";
}

const int = (value: unknown) => Number(value ?? 0);

export type Totals = {
  customers: { active: number; inactive: number };
  sites: { total: number; live: number };
  domains: { total: number; active: number };
  media: { files: number; bytes: number };
};

async function loadTotals(): Promise<Totals> {
  const [c, s, d, m] = await Promise.all([
    db.select({ active: sql<number>`count(*) filter (where ${customers.status} = 'active')`, inactive: sql<number>`count(*) filter (where ${customers.status} = 'inactive')` }).from(customers),
    db.select({ total: count(), live: sql<number>`count(*) filter (where ${sites.status} = 'live')` }).from(sites),
    db.select({ total: count(), active: sql<number>`count(*) filter (where ${siteDomains.status} = 'active')` }).from(siteDomains),
    db.select({ files: count(), bytes: sql<number>`coalesce(sum(${media.bytes}), 0)` }).from(media),
  ]);
  return {
    customers: { active: int(c[0].active), inactive: int(c[0].inactive) },
    sites: { total: int(s[0].total), live: int(s[0].live) },
    domains: { total: int(d[0].total), active: int(d[0].active) },
    media: { files: int(m[0].files), bytes: int(m[0].bytes) },
  };
}

export type Bar = { label: string; count: number };

/**
 * Nieuwe versies (publicaties) per uur of per dag, ook de momenten zonder publicatie (0). Gegroepeerd in de tijdzone van het platform.
 * `unit` en `buckets` komen uit de vaste tabel PERIODS, nooit uit invoer van een gebruiker (vandaar `sql.raw`).
 */
async function loadActivity(period: Period, timezone: string): Promise<Bar[]> {
  const { unit, buckets } = PERIODS[period];
  const unitSql = sql.raw(`'${unit}'`);
  const step = sql.raw(`interval '1 ${unit}'`);
  const back = sql.raw(`${buckets - 1} * interval '1 ${unit}'`);
  const res = await db.execute<{ bucket: string; n: number }>(sql`
    select to_char(b.bucket, 'YYYY-MM-DD"T"HH24:MI') as bucket, count(v.id)::int as n
    from generate_series(
      date_trunc(${unitSql}, now() at time zone ${timezone}) - (${back}),
      date_trunc(${unitSql}, now() at time zone ${timezone}),
      ${step}
    ) as b(bucket)
    left join site_versions v on date_trunc(${unitSql}, v.created_at at time zone ${timezone}) = b.bucket
    group by b.bucket
    order by b.bucket
  `);
  const format = new Intl.DateTimeFormat("nl-NL", unit === "hour" ? { hour: "2-digit", minute: "2-digit", timeZone: "UTC" } : { day: "numeric", month: "short", timeZone: "UTC" });
  // Het label is een tijd op de klok in de tijdzone van het platform; als UTC gelezen en ook als UTC getoond blijft die klok gelijk.
  return res.rows.map((r) => ({ label: format.format(new Date(`${r.bucket}:00Z`)), count: int(r.n) }));
}

export type CustomerRow = { id: string; name: string; tier: "bojob" | "pro"; inactive: boolean; sites: number; live: number; lastPublished: string | null };

async function loadCustomers(): Promise<CustomerRow[]> {
  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      tier: customers.tier,
      status: customers.status,
      sites: count(sites.id),
      live: sql<number>`count(${sites.id}) filter (where ${sites.status} = 'live')`,
      last: max(sites.publishedAt),
    })
    .from(customers)
    .leftJoin(sites, eq(sites.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(desc(count(sites.id)), asc(customers.name))
    .limit(6);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    tier: r.tier,
    inactive: r.status === "inactive",
    sites: int(r.sites),
    live: int(r.live),
    lastPublished: r.last ? timeAgo(r.last) : null,
  }));
}

export type PublicationRow = { id: string; siteId: string; site: string; version: number; note: string | null; who: string | null; when: string; live: boolean };

async function loadPublications(): Promise<PublicationRow[]> {
  const rows = await db
    .select({
      id: siteVersions.id,
      siteId: sites.id,
      site: sites.name,
      version: siteVersions.version,
      note: siteVersions.note,
      at: siteVersions.createdAt,
      who: user.name,
      liveVersion: sites.publishedVersion,
      status: sites.status,
    })
    .from(siteVersions)
    .innerJoin(sites, eq(sites.id, siteVersions.siteId))
    .leftJoin(user, eq(user.id, siteVersions.createdBy))
    .orderBy(desc(siteVersions.createdAt))
    .limit(8);
  return rows.map((r) => ({
    id: r.id,
    siteId: r.siteId,
    site: r.site,
    version: r.version,
    note: r.note,
    who: r.who,
    when: timeAgo(r.at),
    live: r.status === "live" && r.liveVersion === r.version,
  }));
}

export type Overview = {
  period: Period;
  totals: Totals;
  activity: Bar[];
  publicationsInPeriod: number;
  busiest: Bar | null;
  customers: CustomerRow[];
  publications: PublicationRow[];
};

export async function getOverview(period: Period): Promise<Overview> {
  const { timezone } = await getPlatformSettings();
  const [totals, activity, customerRows, publications] = await Promise.all([loadTotals(), loadActivity(period, timezone), loadCustomers(), loadPublications()]);
  const busiest = activity.reduce<Bar | null>((best, bar) => (bar.count > (best?.count ?? 0) ? bar : best), null);
  return { period, totals, activity, publicationsInPeriod: activity.reduce((sum, bar) => sum + bar.count, 0), busiest, customers: customerRows, publications };
}
