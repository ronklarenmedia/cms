import Link from "next/link";
import { Suspense } from "react";
import { getOverview, parsePeriod, PERIOD_KEYS, PERIODS, type Overview } from "@/lib/dashboard";
import { requireStaff } from "@/lib/session";
import { ActivityChart } from "./ActivityChart";
import { SystemStatus, SystemStatusSkeleton } from "./SystemStatus";

// Het platformoverzicht. Alles komt uit de database of is live gemeten; wat het platform niet meet (bezoekers, pageviews)
// staat er bewust niet, met een korte melding.

const number = new Intl.NumberFormat("nl-NL");
const megabytes = (bytes: number) => (bytes < 1024 * 1024 ? `${number.format(Math.round(bytes / 1024))} KB` : `${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MB`);
const plural = (n: number, one: string, many: string) => `${number.format(n)} ${n === 1 ? one : many}`;

function Kpis({ totals }: { totals: Overview["totals"] }) {
  const { customers, sites, domains, media } = totals;
  const items = [
    { icon: "users-three", label: "Klanten", value: number.format(customers.active), note: customers.inactive > 0 ? `${customers.inactive} inactief` : "Alle klanten actief" },
    { icon: "browsers", label: "Websites", value: number.format(sites.total), note: `${sites.live} live · ${sites.total - sites.live} concept` },
    {
      icon: "globe",
      label: "Eigen domeinen",
      value: number.format(domains.active),
      note: domains.total === 0 ? "Nog geen eigen domeinen" : domains.total === domains.active ? "Allemaal actief" : `${domains.total - domains.active} in behandeling`,
    },
    { icon: "image", label: "Beelden", value: number.format(media.files), note: `${megabytes(media.bytes)} in opslag` },
  ];
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
      {items.map((k) => (
        <div key={k.label} className="card elev-sm !gap-1 !p-4">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.08em] text-text/70 uppercase">
            <i className={`ph ph-${k.icon} text-[14px] text-accent`} aria-hidden="true" />
            {k.label}
          </div>
          <div className="font-heading text-[34px] leading-[1.1] font-medium tracking-[-0.02em]">{k.value}</div>
          <div className="text-muted text-[11.5px]">{k.note}</div>
        </div>
      ))}
    </div>
  );
}

function PeriodPicker({ active }: { active: Overview["period"] }) {
  return (
    <nav aria-label="Periode" className="flex w-max max-w-full gap-0.5 rounded-md border border-divider p-0.5 text-[12.5px]">
      {PERIOD_KEYS.map((key) => (
        <Link
          key={key}
          href={key === "30d" ? "/" : `/?periode=${key}`}
          aria-current={key === active ? "page" : undefined}
          className={`rounded-[5px] px-3 py-1 whitespace-nowrap ${key === active ? "bg-text/8 font-medium" : "text-text/70 hover:bg-text/4"}`}
        >
          {PERIODS[key].label}
        </Link>
      ))}
    </nav>
  );
}

function Activity({ overview }: { overview: Overview }) {
  const { period, activity, publicationsInPeriod, busiest } = overview;
  const headline = `${plural(publicationsInPeriod, "publicatie", "publicaties")} in de ${PERIODS[period].title}`;
  const detail = busiest ? `drukste moment: ${busiest.label} (${busiest.count})` : "nog geen publicaties in deze periode";
  return (
    <section className="card elev-sm !gap-3 !p-4">
      <div>
        <div className="font-heading text-[15px] font-medium">Publicaties</div>
        <div className="text-muted text-[11.5px]">
          {headline} · {detail}
        </div>
      </div>
      <ActivityChart bars={activity} summary={`${headline}; ${detail}`} />
      <p className="text-muted !mb-0 border-t border-dashed border-divider pt-3 text-[11.5px]">
        Bezoekers en pageviews volgen zodra er een statistiekbron is gekoppeld; het platform meet die nu niet zelf.
      </p>
    </section>
  );
}

function Customers({ rows }: { rows: Overview["customers"] }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h6 className="!mb-0 text-text/75">Klanten met de meeste websites</h6>
        <Link href="/klanten" className="text-[12px] text-text/70 underline-offset-2 hover:underline">
          Alle klanten
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted !mb-0 text-[13px]">Er zijn nog geen klanten.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Klant</th>
              <th>Plan</th>
              <th className="text-right">Websites</th>
              <th className="text-right">Live</th>
              <th className="text-right">Laatst online</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="font-heading font-medium">
                  <Link href={`/klanten/${c.id}`} className="text-text hover:underline">
                    {c.name}
                  </Link>
                  {c.inactive ? <span className="tag tag-outline ml-2">inactief</span> : null}
                </td>
                <td>
                  <span className={`tag ${c.tier === "pro" ? "tag-accent" : "tag-neutral"}`}>{c.tier === "pro" ? "Pro" : "BOJOB"}</span>
                </td>
                <td className="text-right">{c.sites}</td>
                <td className="text-right">{c.live}</td>
                <td className="text-muted text-right">{c.lastPublished ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Publications({ rows }: { rows: Overview["publications"] }) {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="!mb-0 text-text/75">Recente publicaties</h6>
      {rows.length === 0 ? (
        <p className="text-muted !mb-0 text-[13px]">Er is nog niets gepubliceerd.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
          {rows.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-md bg-surface px-3 py-2">
              <span className={`size-[7px] flex-none rounded-full ${p.live ? "bg-success" : "bg-text/30"}`} aria-hidden="true" />
              <Link href={`/websites/${p.siteId}`} className="min-w-0 flex-1 truncate text-[12.5px] hover:underline" title={p.note ?? undefined}>
                {p.site} <span className="text-muted">v{p.version}</span>
              </Link>
              <span className="text-muted text-[11px] whitespace-nowrap">{p.who ?? "onbekend"}</span>
              <span className="text-muted text-[11px] whitespace-nowrap">{p.when}</span>
              <span className={`text-[11px] whitespace-nowrap ${p.live ? "text-success" : "text-text/55"}`}>{p.live ? "Live" : "Eerder"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function PlatformPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  await requireStaff(); // controle op de sessie; maakt de pagina ook dynamisch (live database-data)
  const overview = await getOverview(parsePeriod((await searchParams).periode));

  return (
    <div className="flex max-w-[1100px] flex-col gap-[calc(var(--space-8)*1.3)]">
      <div className="flex flex-wrap items-end gap-[var(--space-6)]">
        <div className="min-w-[240px] flex-1">
          <h2 className="!mb-1">Platformoverzicht</h2>
          <div className="text-muted text-[12.5px]">Live uit de database bij het openen van deze pagina</div>
        </div>
        <PeriodPicker active={overview.period} />
      </div>

      <Suspense fallback={<SystemStatusSkeleton />}>
        <SystemStatus />
      </Suspense>

      <Kpis totals={overview.totals} />
      <Activity overview={overview} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-[var(--space-6)]">
        <Customers rows={overview.customers} />
        <Publications rows={overview.publications} />
      </div>
    </div>
  );
}
