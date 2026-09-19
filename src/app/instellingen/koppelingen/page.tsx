import { checkDatabase } from "@/lib/health";
import { requireStaff } from "@/lib/session";
import { Panel } from "../ui";

type Connection = { name: string; icon: string; note: string; state: "ok" | "storing" | "leeg"; label: string };

// Alleen wat echt gemeten of ingebouwd is, staat op "Verbonden". De rest is bewust "Niet gekoppeld".
const notConnected: Omit<Connection, "state" | "label">[] = [
  { name: "Vercel", icon: "triangle", note: "Hosting van klantsites. Wacht op de keuze hoe klantsites worden gehost." },
  { name: "Cloudflare", icon: "cloud", note: "DNS, CDN en mogelijk opslag voor uploads (R2). Keuze voor opslag staat open." },
  { name: "Anthropic API", icon: "sparkle", note: "AI-aanpassing en generator in de builder. Staat nu uit." },
  { name: "Resend", icon: "envelope-simple", note: "E-mail: meldingen en uitnodigingen." },
  { name: "Moneybird", icon: "receipt", note: "Boekhouding en facturen. Besloten, nog niet gekoppeld." },
  { name: "Mollie of Stripe", icon: "credit-card", note: "Incasso. De keuze voor de betaalprovider staat nog open." },
  { name: "GitHub", icon: "git-branch", note: "Eigen componentrepo's; optioneel, voor later." },
];

const dot = { ok: "bg-success", storing: "bg-danger", leeg: "bg-text/30" } as const;
const tone = { ok: "text-success", storing: "text-danger", leeg: "text-text/55" } as const;

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
  const db = await checkDatabase();

  const active: Connection[] = [
    db.ok
      ? {
          name: "Neon Postgres",
          icon: "database",
          note: `${db.region ? `Regio ${db.region} · ` : ""}antwoordt in ${db.ms} ms`,
          state: "ok",
          label: "Verbonden",
        }
      : { name: "Neon Postgres", icon: "database", note: "De database antwoordt niet.", state: "storing", label: "Storing" },
    {
      name: "Inloggen",
      icon: "lock-key",
      note: "Better Auth, in de eigen database. Zie Beveiliging voor het beleid.",
      state: "ok",
      label: "Ingebouwd",
    },
  ];

  return (
    <div className="flex max-w-[860px] flex-col gap-[var(--space-6)]">
      <Panel title="Actief" description="Live gemeten bij het openen van deze pagina. Er worden geen sleutels of connectiestrings getoond.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {active.map((c) => (
            <Row key={c.name} c={c} />
          ))}
        </ul>
      </Panel>

      <Panel title="Nog niet gekoppeld" description="Koppelingen komen er per onderdeel bij zodra dat onderdeel gebouwd wordt.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {notConnected.map((c) => (
            <Row key={c.name} c={{ ...c, state: "leeg", label: "Niet gekoppeld" }} />
          ))}
        </ul>
      </Panel>
    </div>
  );
}
