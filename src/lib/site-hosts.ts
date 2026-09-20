// Welke hostnamen bij welke site horen, en welke hosts het platform zelf zijn. Alleen namen uit de omgeving, geen geheimen.
//
// PLATFORM_HOSTS  komma-gescheiden hosts van het beheer (bijv. "localhost:3000,platform.voorbeeld.nl,*.vercel.app"). Alles wat hier niet in
//                 staat, wordt als openbare site behandeld. Leeg = alles is beheer (er wordt dan nooit een openbare site getoond).
//                 Een regel met "*." vooraan (bijv. "*.vercel.app") geldt voor elk subdomein daaronder, zoals de adressen die Vercel zelf
//                 aan een deployment geeft; die verwijzen altijd naar deze app en horen dus bij het beheer.
// PREVIEW_DOMAIN  het domein voor voorbeeldadressen: <sitenaam>.<PREVIEW_DOMAIN> toont de gepubliceerde site met die naam.

const list = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

export const normalizeHost = (host: string) => host.trim().toLowerCase().replace(/\.$/, "");

export const platformHosts = () => list(process.env.PLATFORM_HOSTS);
export const previewDomain = () => (process.env.PREVIEW_DOMAIN ?? "").trim().toLowerCase() || null;

export function isPlatformHost(host: string): boolean {
  const h = normalizeHost(host);
  return platformHosts().some((entry) => (entry.startsWith("*.") ? h.endsWith(entry.slice(1)) && h.length > entry.length - 1 : entry === h));
}

/** Het voorbeeldadres van een site, of null als er geen PREVIEW_DOMAIN is ingesteld. */
export function previewHost(slug: string): string | null {
  const domain = previewDomain();
  return domain ? `${slug}.${domain}` : null;
}

/** De sitenaam uit een voorbeeldadres (`demo.voorbeeld.nl` → `demo`), of null als de host daar niet onder valt. */
export function slugFromPreviewHost(host: string): string | null {
  const domain = previewDomain();
  const h = normalizeHost(host);
  if (!domain || !h.endsWith(`.${domain}`)) return null;
  const slug = h.slice(0, -(domain.length + 1));
  // Eén label: geen punten in de sitenaam.
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? slug : null;
}

/** Zoveel eigen domeinen mag één site hebben (bijv. het kale domein en www). */
export const MAX_DOMAINS_PER_SITE = 5;

const withoutPort = (host: string) => host.replace(/:\d+$/, "");

/**
 * Controleert een door een medewerker ingevuld domein en geeft de hostnaam in kleine letters terug (IDN als punycode).
 * Weigert wat geen eigen domein van een klant kan zijn: een adres met poort of pad, een wildcard, een IP-adres,
 * localhost, en alles wat bij het platform zelf hoort (beheerhosts en het domein voor voorbeeldadressen).
 */
export function validateCustomHostname(input: string): { ok: true; hostname: string } | { ok: false; error: string } {
  const fail = (error: string) => ({ ok: false as const, error });
  let raw = input.trim().toLowerCase();
  if (!raw) return fail("Vul een domeinnaam in, bijvoorbeeld klant.nl.");
  raw = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[/?#]/)[0].replace(/\.$/, "");
  if (raw.startsWith("*.")) return fail("Een wildcard-domein (*.klant.nl) kan niet worden gekoppeld.");
  if (raw.includes(":") || raw.includes("@")) return fail("Vul alleen de domeinnaam in, zonder poort of gebruikersnaam.");

  let host: string;
  try {
    host = new URL(`http://${raw}`).hostname; // zet internationale domeinnamen om naar punycode
  } catch {
    return fail("Dit is geen geldige domeinnaam.");
  }
  const labels = host.split(".");
  const validLabel = (l: string) => /^(?!-)[a-z0-9-]{1,63}(?<!-)$/.test(l);
  const tld = labels[labels.length - 1];
  if (host.length > 253 || labels.length < 2 || !labels.every(validLabel) || !/^([a-z]{2,}|xn--[a-z0-9-]+)$/.test(tld)) {
    return fail("Dit is geen geldige domeinnaam, bijvoorbeeld klant.nl of www.klant.nl.");
  }
  if (host === "localhost" || host.endsWith(".localhost")) return fail("Dit adres kan niet als eigen domein worden gebruikt.");

  const reserved = [...platformHosts().map((h) => withoutPort(h.replace(/^\*\./, ''))), previewDomain() ? withoutPort(previewDomain()!) : null].filter((h): h is string => Boolean(h));
  if (reserved.some((r) => host === r || host.endsWith(`.${r}`))) return fail("Dit domein hoort bij het platform zelf en kan niet aan een klantsite worden gekoppeld.");
  return { ok: true, hostname: host };
}
