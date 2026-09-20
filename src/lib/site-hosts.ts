// Welke hostnamen bij welke site horen, en welke hosts het platform zelf zijn. Alleen namen uit de omgeving, geen geheimen.
//
// PLATFORM_HOSTS  komma-gescheiden hosts van het beheer (bijv. "localhost:3000,beheer.jouwplatform.nl"). Alles wat hier niet in staat,
//                 wordt als openbare site behandeld. Leeg = alles is beheer (er wordt dan nooit een openbare site getoond).
// PREVIEW_DOMAIN  het domein voor voorbeeldadressen: <sitenaam>.<PREVIEW_DOMAIN> toont de gepubliceerde site met die naam.

const list = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

export const normalizeHost = (host: string) => host.trim().toLowerCase().replace(/\.$/, "");

export const platformHosts = () => list(process.env.PLATFORM_HOSTS);
export const previewDomain = () => (process.env.PREVIEW_DOMAIN ?? "").trim().toLowerCase() || null;

export const isPlatformHost = (host: string) => platformHosts().includes(normalizeHost(host));

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

/** De hosts waaronder een site bereikbaar is (voor het ongeldig maken van de cache). */
export function hostsOfSite(site: { slug: string }): string[] {
  const preview = previewHost(site.slug);
  return preview ? [preview] : [];
}
