import { checkDatabase, checkStorage, type StorageHealth } from "@/lib/health";
import { requireStaff } from "@/lib/session";
import { checkVercel, type VercelHealth } from "@/lib/vercel-domains";
import { Panel } from "../ui";

type State = "ok" | "storing" | "let-op" | "leeg";
type Connection = { name: string; icon: string; note: string; state: State; label: string };

const dot = { ok: "bg-success", storing: "bg-danger", "let-op": "bg-warning", leeg: "bg-text/30" } as const;
const tone = { ok: "text-success", storing: "text-danger", "let-op": "text-warning", leeg: "text-text/55" } as const;

// Alleen wat echt gemeten of ingebouwd is, staat op "Verbonden". Een aanwezige sleutel zonder controle is "Sleutel ingesteld".
// Alleen namen van variabelen worden getoond, nooit hun waarde.
const keyOnly = [
  { name: "Anthropic API", icon: "sparkle", env: "ANTHROPIC_API_KEY", note: "AI-aanpassing en generator in de builder." },
  { name: "Resend", icon: "envelope-simple", env: "RESEND_API_KEY", note: "E-mail: meldingen en uitnodigingen." },
] as const;

const notBuilt: Omit<Connection, "state" | "label">[] = [
  { name: "Moneybird", icon: "receipt", note: "Boekhouding en facturen. Besloten, nog niet gekoppeld." },
  { name: "Mollie of Stripe", icon: "credit-card", note: "Incasso. De keuze voor de betaalprovider staat nog open." },
  { name: "GitHub", icon: "git-branch", note: "Eigen componentrepo's; optioneel, voor later." },
];

function storageConnection(h: StorageHealth): Connection {
  const base = { name: "Cloudflare R2", icon: "cloud" };
  switch (h.status) {
    case "unconfigured":
      return {
        ...base,
        state: "leeg",
        label: "Niet gekoppeld",
        note: `Opslag voor uploads. Zet ${h.missing.join(", ")} in .env.local (zie .env.example).`,
      };
    case "error": {
      const why = {
        auth: "De sleutels worden geweigerd, of de bucket bestaat niet in dit account. Controleer de token (Object Read & Write op deze bucket) en R2_BUCKET.",
        "not-found": "De bucket bestaat niet. Controleer R2_BUCKET.",
        unreachable: "Cloudflare R2 is niet bereikbaar. Controleer R2_ENDPOINT.",
        unexpected: `Onverwacht antwoord van R2 (status ${h.httpStatus}).`,
      }[h.reason];
      return { ...base, state: "storing", label: "Storing", note: why };
    }
    case "ok": {
      const bucket = `Bucket bereikbaar in ${h.ms} ms`;
      if (h.publicUrl === "reachable") return { ...base, state: "ok", label: "Verbonden", note: `${bucket} · openbare URL bereikbaar` };
      if (h.publicUrl === "unreachable")
        return {
          ...base,
          state: "let-op",
          label: "Openbare URL onbereikbaar",
          note: `${bucket}, maar R2_PUBLIC_URL geeft geen antwoord. Is het eigen domein gekoppeld aan de bucket en actief?`,
        };
      return { ...base, state: "let-op", label: "Openbare URL ontbreekt", note: `${bucket}. Zet R2_PUBLIC_URL, anders zijn geüploade bestanden niet te tonen.` };
    }
  }
}

function vercelConnection(h: VercelHealth): Connection {
  const base = { name: "Vercel", icon: "triangle" };
  switch (h.status) {
    case "unconfigured":
      return {
        ...base,
        state: "leeg",
        label: "Niet gekoppeld",
        note: `Hosting en eigen domeinen van klanten. Zet ${h.missing.join(", ")} in .env.local (VERCEL_TEAM_ID is optioneel, zie .env.example).`,
      };
    case "error": {
      const why = {
        auth: "Vercel weigert de toegang. Controleer VERCEL_TOKEN en de rechten van het token.",
        "not-found": "Het project bestaat niet of het token hoort er niet bij. Controleer VERCEL_PROJECT_ID en VERCEL_TEAM_ID.",
        unreachable: "Vercel is niet bereikbaar.",
        unexpected: `Onverwacht antwoord van Vercel (status ${h.httpStatus}).`,
      }[h.reason];
      return { ...base, state: "storing", label: "Storing", note: why };
    }
    case "ok":
      return { ...base, state: "ok", label: "Verbonden", note: `Project bereikbaar in ${h.ms} ms · eigen domeinen worden hier aangemeld` };
  }
}

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
  const [db, storage, vercel] = await Promise.all([checkDatabase(), checkStorage(), checkVercel()]);

  const connections: Connection[] = [
    db.ok
      ? {
          name: "Neon Postgres",
          icon: "database",
          note: `${db.region ? `Regio ${db.region} · ` : ""}antwoordt in ${db.ms} ms`,
          state: "ok",
          label: "Verbonden",
        }
      : { name: "Neon Postgres", icon: "database", note: "De database antwoordt niet.", state: "storing", label: "Storing" },
    storageConnection(storage),
    vercelConnection(vercel),
    {
      name: "Inloggen",
      icon: "lock-key",
      note: "Better Auth, in de eigen database. Zie Beveiliging voor het beleid.",
      state: "ok",
      label: "Ingebouwd",
    },
    ...keyOnly.map((s): Connection =>
      process.env[s.env]?.trim()
        ? { name: s.name, icon: s.icon, state: "let-op", label: "Sleutel ingesteld", note: `${s.note} De sleutel is aanwezig; live controle volgt zodra dit onderdeel gebouwd is.` }
        : { name: s.name, icon: s.icon, state: "leeg", label: "Niet gekoppeld", note: `${s.note} Zet ${s.env} in .env.local om te koppelen.` },
    ),
    ...notBuilt.map((c): Connection => ({ ...c, state: "leeg", label: "Niet gekoppeld" })),
  ];

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
