import { requireStaff } from "@/lib/session";
import { Panel } from "../ui";
import { dot, getConnections, tone, type Connection } from "./connections";

function Row({ c }: { c: Connection }) {
  return (
    <li className="card elev-sm flex-row items-center !gap-4">
      <i className={`ph ph-${c.icon} text-[20px] text-text/70`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium">{c.name}</div>
        <div className="text-muted text-[12px]">{c.note}</div>
      </div>
      <span className={`flex flex-none items-center gap-2 text-[12.5px] ${tone[c.state]}`}>
        <span className={`size-2 rounded-full ${dot[c.state]}`} aria-hidden="true" />
        {c.label}
      </span>
    </li>
  );
}

export default async function KoppelingenPage() {
  await requireStaff();
  const connections = await getConnections();

  const active = connections.filter((c) => c.state !== "leeg");
  const inactive = connections.filter((c) => c.state === "leeg");

  return (
    <div className="flex max-w-[860px] flex-col gap-[var(--space-6)]">
      <Panel title="Actief" description="Live gemeten bij het openen van deze pagina. Er worden geen sleutels, adressen of connectiestrings getoond.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {active.map((c) => (
            <Row key={c.name} c={c} />
          ))}
        </ul>
      </Panel>

      {inactive.length > 0 && (
        <Panel title="Nog niet gekoppeld" description="Sleutels zet je in .env.local (lokaal) of de omgevingsvariabelen van de hosting; koppelingen komen er per onderdeel bij.">
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {inactive.map((c) => (
              <Row key={c.name} c={c} />
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
