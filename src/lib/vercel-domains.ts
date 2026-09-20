// Koppeling met de Vercel-API voor de eigen domeinen van klanten. Alleen op de server. Het token komt uit de omgeving en wordt
// nergens getoond of gelogd.
//
// PLATFORM_VERCEL_TOKEN       token met rechten op het project
// PLATFORM_VERCEL_PROJECT_ID  id of naam van het Vercel-project waar de app draait. Op Vercel zelf is dit niet nodig: Vercel zet
//                             `VERCEL_PROJECT_ID` automatisch (een systeemvariabele die wij als terugval lezen).
// PLATFORM_VERCEL_TEAM_ID     optioneel: het team dat het project bezit (leeg bij een persoonlijk account)
//
// De namen beginnen niet met VERCEL_: Vercel weigert zulke namen voor eigen variabelen (die zijn voor systeemvariabelen).
// Zonder deze variabelen doet de koppeling niets: domeinen worden dan wel opgeslagen, maar niet bij Vercel aangemeld.
// Endpoints volgens https://vercel.com/docs/platforms/multi-tenant-platforms/reference (add/get/verify/remove project domain)
// en https://vercel.com/docs/rest-api/domains/get-a-domain-s-configuration.

// Alleen buiten productie mag het adres worden overschreven (PLATFORM_VERCEL_API_URL), om de koppeling tegen een testserver te draaien.
// In productie is het altijd de echte API, zodat het token nooit naar een ander adres kan.
const API = (process.env.NODE_ENV !== "production" && process.env.PLATFORM_VERCEL_API_URL?.trim()) || "https://api.vercel.com";
const TIMEOUT_MS = 10_000;

type Config = { token: string; projectId: string; teamId: string | null };

export function getVercelConfig(): Config | null {
  const token = process.env.PLATFORM_VERCEL_TOKEN?.trim();
  const projectId = process.env.PLATFORM_VERCEL_PROJECT_ID?.trim() || process.env.VERCEL_PROJECT_ID?.trim();
  if (!token || !projectId) return null;
  return { token, projectId, teamId: process.env.PLATFORM_VERCEL_TEAM_ID?.trim() || null };
}

export const isVercelConfigured = () => getVercelConfig() !== null;

/** Namen (nooit waarden) van de verplichte variabelen die nog leeg zijn. */
export const missingVercelVars = (): string[] => [
  ...(process.env.PLATFORM_VERCEL_TOKEN?.trim() ? [] : ["PLATFORM_VERCEL_TOKEN"]),
  ...(process.env.PLATFORM_VERCEL_PROJECT_ID?.trim() || process.env.VERCEL_PROJECT_ID?.trim() ? [] : ["PLATFORM_VERCEL_PROJECT_ID"]),
];

/** Wat een klant of medewerker moet weten om een domein werkend te krijgen. */
export type DomainDetail = {
  /** Eigendom vastgesteld? Onwaar als het domein al elders bij Vercel hangt en een TXT-record nodig is. */
  verified: boolean;
  /** Alleen bij een niet-geverifieerd domein: het record dat de klant moet aanmaken. */
  verification: { type: string; domain: string; value: string }[];
  /** Klaar voor gebruik: geverifieerd, DNS wijst naar Vercel en er kan een certificaat worden uitgegeven. */
  active: boolean;
  /** Aanbevolen A-record(s) voor een kaal domein, en CNAME voor een subdomein. */
  a: string[];
  cname: string | null;
};

export type ProviderResult<T> = { ok: true; value: T } | { ok: false; error: string };

type Reply = { status: number; data: Record<string, unknown> | null };

async function call(method: string, path: string, query: Record<string, string | undefined> = {}, body?: unknown): Promise<Reply> {
  const config = getVercelConfig()!;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...query, teamId: config.teamId ?? undefined })) if (v) params.set(k, v);
  const res = await fetch(`${API}${path}${params.size ? `?${params}` : ""}`, {
    method,
    headers: { Authorization: `Bearer ${config.token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  return { status: res.status, data };
}

const NOT_CONFIGURED = "Vercel is nog niet gekoppeld (PLATFORM_VERCEL_TOKEN en het project-id).";

/** Een begrijpelijke melding voor een mislukt verzoek, zonder technische details of het token. */
function explain(status: number, action: string): string {
  if (status === 401 || status === 403) return "Vercel weigert de toegang. Controleer PLATFORM_VERCEL_TOKEN en de rechten van het token.";
  if (status === 402) return "Vercel vraagt om een betaalmethode voor dit account.";
  if (status === 409) return "Dit domein hangt al aan een ander Vercel-project of -account. Verwijder het daar eerst, of bewijs eigendom met het TXT-record.";
  if (status === 404) return "Dit domein staat niet (meer) in het Vercel-project.";
  if (status === 429) return "Vercel ontvangt te veel verzoeken. Probeer het over een paar minuten opnieuw.";
  return `${action} is mislukt (Vercel antwoordde met status ${status}).`;
}

const unreachable = "Vercel is niet bereikbaar. Probeer het later opnieuw.";

const domainPath = (hostname: string) => `/v9/projects/${encodeURIComponent(getVercelConfig()!.projectId)}/domains/${encodeURIComponent(hostname)}`;

type Challenge = { type: string; domain: string; value: string };
const challenges = (data: Record<string, unknown> | null): Challenge[] =>
  Array.isArray(data?.verification)
    ? (data.verification as Record<string, unknown>[]).map((v) => ({ type: String(v.type ?? ""), domain: String(v.domain ?? ""), value: String(v.value ?? "") }))
    : [];

/** De DNS-aanbevelingen van Vercel voor dit domein (rank 1 is de voorkeur). */
async function dnsConfig(hostname: string): Promise<{ misconfigured: boolean; a: string[]; cname: string | null } | null> {
  const { status, data } = await call("GET", `/v6/domains/${encodeURIComponent(hostname)}/config`, { projectIdOrName: getVercelConfig()!.projectId });
  if (status !== 200 || !data) return null;
  const best = <T extends { rank: number }>(list: unknown): T | undefined =>
    (Array.isArray(list) ? (list as T[]) : []).sort((x, y) => x.rank - y.rank)[0];
  const ipv4 = best<{ rank: number; value: string[] }>(data.recommendedIPv4);
  const cname = best<{ rank: number; value: string }>(data.recommendedCNAME);
  return { misconfigured: data.misconfigured !== false, a: ipv4?.value ?? [], cname: cname?.value ?? null };
}

/** De huidige stand van een domein bij Vercel; met `verify` wordt eerst geprobeerd het eigendom te bevestigen. */
export async function domainStatus(hostname: string, { verify = false }: { verify?: boolean } = {}): Promise<ProviderResult<DomainDetail>> {
  if (!isVercelConfigured()) return { ok: false, error: NOT_CONFIGURED };
  try {
    const { status, data } = await call("GET", domainPath(hostname));
    if (status !== 200 || !data) return { ok: false, error: explain(status, "Ophalen") };
    let verified = data.verified === true;
    let verification = challenges(data);
    if (!verified && verify) {
      const res = await call("POST", `${domainPath(hostname)}/verify`);
      if (res.status === 200 && res.data?.verified === true) {
        verified = true;
        verification = [];
      }
      // Een mislukte controle (TXT-record nog niet zichtbaar) is geen fout: de challenge blijft gewoon getoond.
    }
    const dns = await dnsConfig(hostname);
    return { ok: true, value: { verified, verification, active: verified && dns !== null && !dns.misconfigured, a: dns?.a ?? [], cname: dns?.cname ?? null } };
  } catch {
    return { ok: false, error: unreachable };
  }
}

/** Meldt een domein aan bij het Vercel-project. Bestaat het al in dit project, dan is dat geen fout. */
export async function addDomain(hostname: string): Promise<ProviderResult<DomainDetail>> {
  if (!isVercelConfigured()) return { ok: false, error: NOT_CONFIGURED };
  try {
    const { status, data } = await call("POST", `/v10/projects/${encodeURIComponent(getVercelConfig()!.projectId)}/domains`, {}, { name: hostname });
    const alreadyThere = status === 400 && JSON.stringify(data ?? {}).toLowerCase().includes("already");
    if (status !== 200 && !alreadyThere) return { ok: false, error: explain(status, "Toevoegen") };
    return domainStatus(hostname);
  } catch {
    return { ok: false, error: unreachable };
  }
}

/** Haalt een domein uit het Vercel-project. Een domein dat er al niet meer staat, telt als gelukt. */
export async function removeDomain(hostname: string): Promise<ProviderResult<null>> {
  if (!isVercelConfigured()) return { ok: true, value: null };
  try {
    const { status } = await call("DELETE", domainPath(hostname));
    if (status === 200 || status === 404) return { ok: true, value: null };
    return { ok: false, error: explain(status, "Verwijderen") };
  } catch {
    return { ok: false, error: unreachable };
  }
}

export type VercelHealth =
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; reason: "auth" | "not-found" | "unreachable" | "unexpected"; httpStatus?: number }
  | { status: "ok"; ms: number };

/** Een echte controle: het project opvragen bewijst dat token, project en team kloppen. */
export async function checkVercel(): Promise<VercelHealth> {
  const config = getVercelConfig();
  if (!config) return { status: "unconfigured", missing: missingVercelVars() };
  const started = performance.now();
  try {
    const { status } = await call("GET", `/v9/projects/${encodeURIComponent(config.projectId)}`);
    if (status === 401 || status === 403) return { status: "error", reason: "auth", httpStatus: status };
    if (status === 404) return { status: "error", reason: "not-found", httpStatus: 404 };
    if (status !== 200) return { status: "error", reason: "unexpected", httpStatus: status };
    return { status: "ok", ms: Math.round(performance.now() - started) };
  } catch {
    return { status: "error", reason: "unreachable" };
  }
}
