// Kleine fetch-wrapper naar de Payload REST API.
// SITE_ID + PAYLOAD_API_URL komen uit de env van dít Vercel-project
// (elke klantsite heeft z'n eigen Vercel-project met eigen env vars,
// zie het architectuurdocument §2 en §9).

const PAYLOAD_API_URL = import.meta.env.PAYLOAD_API_URL;
const PAYLOAD_API_KEY = import.meta.env.PAYLOAD_API_KEY;
const SITE_ID = import.meta.env.SITE_ID;

async function payloadFetch(path: string, init: RequestInit = {}) {
  if (!PAYLOAD_API_URL) {
    throw new Error("PAYLOAD_API_URL ontbreekt — zet 'm in .env (zie .env.example)");
  }

  const res = await fetch(`${PAYLOAD_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(PAYLOAD_API_KEY ? { Authorization: `users API-Key ${PAYLOAD_API_KEY}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Payload API-fout (${res.status}) bij ${path}`);
  }

  return res.json();
}

export async function getSite() {
  if (!SITE_ID) {
    throw new Error("SITE_ID ontbreekt — elke build/preview-request hoort deze te zetten");
  }
  return payloadFetch(`/api/sites/${SITE_ID}?depth=1`);
}

export async function getPageBySlug(slug: string) {
  const result = await payloadFetch(
    `/api/pages?where[site][equals]=${SITE_ID}&where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
  );
  return result.docs?.[0] ?? null;
}

// Voor de CMS-preview-route: pagina op ID i.p.v. slug, met draft=true zodat
// een nog niet gepubliceerd concept ook te bekijken is.
export async function getPageById(id: string, opts: { draft?: boolean } = {}) {
  const draftParam = opts.draft ? "&draft=true" : "";
  return payloadFetch(`/api/pages/${id}?depth=2${draftParam}`);
}
