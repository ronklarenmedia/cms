import Link from "next/link";
import { dot, getConnections, tone } from "./instellingen/koppelingen/connections";

// De live gemeten koppelingen op het platformoverzicht. Een eigen component zodat de pagina eromheen niet wacht op de controles
// (Neon, R2 en Vercel worden bij elk bezoek gemeten); in de tussentijd staat er een tijdelijke plek.

export function SystemStatusSkeleton() {
  return (
    <section className="flex flex-col gap-3" aria-busy="true">
      <StatusHeading text="Koppelingen worden gecontroleerd…" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card elev-sm h-[84px] animate-pulse" aria-hidden="true" />
        ))}
      </div>
    </section>
  );
}

function StatusHeading({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h6 className="!mb-0 text-text/75">Systeemstatus</h6>
      <span className="text-muted text-[11.5px]">{text}</span>
      <Link href="/instellingen/koppelingen" className="ml-auto text-[12px] text-text/70 underline-offset-2 hover:underline">
        Alle koppelingen
      </Link>
    </div>
  );
}

export async function SystemStatus() {
  const connections = (await getConnections()).filter((c) => c.state !== "leeg");
  const attention = connections.filter((c) => c.state === "storing" || c.state === "let-op").length;

  return (
    <section className="flex flex-col gap-3">
      <StatusHeading text={attention === 0 ? "Alles werkt" : `${attention} van ${connections.length} koppelingen vragen aandacht`} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
        {connections.map((c) => (
          <div key={c.name} className="card elev-sm !gap-2">
            <div className="flex items-center gap-2">
              <i className={`ph ph-${c.icon} text-[15px] text-text/60`} aria-hidden="true" />
              <span className="min-w-0 flex-1 text-[13.5px] font-medium">{c.name}</span>
              <span className={`size-[7px] flex-none rounded-full ${dot[c.state]}`} aria-hidden="true" />
            </div>
            <div className={`text-[11.5px] ${tone[c.state]}`}>{c.label}</div>
            <div className="text-muted text-[11px]">{c.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
