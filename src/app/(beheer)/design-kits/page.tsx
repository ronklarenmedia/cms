import { asc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { customers, designKits, sites } from "@/db/schema";
import { requireStaff } from "@/lib/session";
import { fontName, KitCard } from "./KitPreview";

// Alle design kits: platformkits (voor elke klant) en de kits per klant. Elke kaart opent de editor.

export default async function DesignKitsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireStaff(); // controle op de sessie; maakt de pagina ook dynamisch (live database-data)
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const needle = q.toLowerCase();

  const rows = await db
    .select({
      id: designKits.id,
      name: designKits.name,
      theme: designKits.theme,
      customerId: designKits.customerId,
      customerName: customers.name,
      uses: sql<number>`(select count(*) from ${sites} where ${sites.designKitId} = ${designKits.id})`,
    })
    .from(designKits)
    .leftJoin(customers, eq(customers.id, designKits.customerId))
    .orderBy(asc(customers.name), asc(designKits.name));

  const kits = rows.filter((k) => !needle || k.name.toLowerCase().includes(needle) || (k.customerName ?? "platform").toLowerCase().includes(needle));
  // Platformkits eerst, daarna per klant op naam (de query sorteert al; `null` komt daar als laatste).
  const groups = [
    { key: "platform", label: "Platformkits", note: "Voor elke klant beschikbaar", kits: kits.filter((k) => !k.customerId) },
    ...[...new Set(kits.filter((k) => k.customerId).map((k) => k.customerName as string))].map((name) => ({
      key: name,
      label: name,
      note: "Alleen voor deze klant",
      kits: kits.filter((k) => k.customerName === name),
    })),
  ].filter((g) => g.kits.length > 0);

  return (
    <div className="flex max-w-[1100px] flex-col gap-[var(--space-6)]">
      <div className="flex flex-wrap items-end gap-[var(--space-6)]">
        <div className="min-w-[220px] flex-1">
          <h2 className="!mb-1">Design kits</h2>
          <div className="text-muted text-[12.5px]">
            {rows.length} {rows.length === 1 ? "kit" : "kits"} · een kit is een opgeslagen thema waar websites naar verwijzen
          </div>
        </div>
        <div className="flex items-center gap-2">
          <form action="/design-kits" className="field w-[220px]">
            <input className="input" type="search" name="q" defaultValue={q} placeholder="Zoek kit of klant" aria-label="Zoek kit of klant" />
          </form>
          <Link href="/design-kits/nieuw" className="btn btn-primary">
            <i className="ph ph-plus" /> Nieuwe kit
          </Link>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-muted !mb-0 text-[13px]">{q ? `Geen kits gevonden voor "${q}".` : "Er zijn nog geen design kits."}</p>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <h5 className="!m-0">{g.label}</h5>
              <span className="text-muted text-[11.5px]">
                {g.note} · {g.kits.length}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
              {g.kits.map((k) => {
                const uses = Number(k.uses);
                return (
                  <Link key={k.id} href={`/design-kits/${k.id}`} className="group flex flex-col gap-2 !text-inherit no-underline">
                    <div className="transition-transform group-hover:-translate-y-0.5">
                      <KitCard theme={k.theme} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading text-[13.5px] font-medium">{k.name}</div>
                      <div className="text-muted truncate text-[11.5px]">
                        {k.customerName ?? "Platform"} · {uses === 0 ? "nog niet gebruikt" : `${uses} ${uses === 1 ? "website" : "websites"}`}
                      </div>
                      <div className="text-muted truncate text-[11px]">{fontName(k.theme)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
