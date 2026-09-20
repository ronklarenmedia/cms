import { checkDatabase, checkStorage, type StorageHealth } from "@/lib/health";
import { checkVercel, type VercelHealth } from "@/lib/vercel-domains";

// De koppelingen van het platform met hun live gemeten status. Gebruikt door Instellingen → Koppelingen en door het platformoverzicht.
// Alleen namen van variabelen komen in de teksten, nooit een waarde.

export type State = "ok" | "storing" | "let-op" | "leeg";
export type Connection = { name: string; icon: string; note: string; state: State; label: string };

export const dot = { ok: "bg-success", storing: "bg-danger", "let-op": "bg-warning", leeg: "bg-text/30" } as const;
export const tone = { ok: "text-success", storing: "text-danger", "let-op": "text-warning", leeg: "text-text/55" } as const;

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
        note: `Hosting en eigen domeinen van klanten. Zet ${h.missing.join(", ")} in .env.local of bij de omgevingsvariabelen van de hosting (PLATFORM_VERCEL_TEAM_ID is optioneel, zie .env.example).`,
      };
    case "error": {
      const why = {
        auth: "Vercel weigert de toegang. Controleer PLATFORM_VERCEL_TOKEN en de rechten van het token.",
        "not-found": "Het project bestaat niet of het token hoort er niet bij. Controleer het project-id en PLATFORM_VERCEL_TEAM_ID.",
        unreachable: "Vercel is niet bereikbaar.",
        unexpected: `Onverwacht antwoord van Vercel (status ${h.httpStatus}).`,
      }[h.reason];
      return { ...base, state: "storing", label: "Storing", note: why };
    }
    case "ok":
      return { ...base, state: "ok", label: "Verbonden", note: `Project bereikbaar in ${h.ms} ms · eigen domeinen worden hier aangemeld` };
  }
}

/** Alle koppelingen, met een live controle van Neon, R2 en Vercel (parallel). */
export async function getConnections(): Promise<Connection[]> {
  const [db, storage, vercel] = await Promise.all([checkDatabase(), checkStorage(), checkVercel()]);
  return [
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
}
