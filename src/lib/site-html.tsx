/* eslint-disable @next/next/no-head-element, @next/next/no-sync-scripts -- dit is een los HTML-document (geen Next-pagina): <head> hoort hier, en een module-script is van nature uitgesteld. */
import type { ReactElement } from "react";
import { prerender } from "react-dom/static";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { themeToCssVars } from "@/blocks/theme";
import { documentTitle } from "@/app/(beheer)/websites/seo";
import { SiteFrame } from "@/app/(beheer)/websites/SiteFrame";
import { enhancementsFor, enhancementUrl } from "./enhancements";
import { fallbackFaviconDataUri, faviconUrl } from "./favicon";
import { originOf, pagePath, type PublicSite } from "./public-site";
import { siteCss } from "./site-css";
import { ThemeFonts } from "./theme-fonts";

// Het HTML-document van een openbare site, als pure HTML: geen React in de browser, geen hydratatie, geen bundel. Alleen op de server.
// De pagina wordt met `react-dom/static` opgebouwd (dat werkt in een route-handler, `react-dom/server` niet). React tilt <title>, <meta>, <link>
// en <style href precedence> zelf naar de <head>. Het enige script op een pagina is JSON-LD (gegevens, geen code) en, als een block er een
// nodig heeft, een klein los script uit ./enhancements.ts.

type Page = PublicSite["snapshot"]["pages"][number];

const first = (value: string | null | undefined) => value?.trim() || undefined;

function SiteDocument({ site, page }: { site: PublicSite; page: Page }): ReactElement {
  const { theme, layout, name, favicon } = site.snapshot;
  const title = documentTitle(name, page);
  const description = first(page.seoDescription);
  const hidden = site.kind === "preview" || page.noindex; // een voorbeeldadres staat nooit in zoekmachines
  const origin = originOf(site.host);
  const canonical = `${origin}${page.slug === "" ? "" : pagePath(page.slug)}`;
  const image = first(page.ogImage);
  const scripts = enhancementsFor(page, layout);

  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        {hidden ? <meta name="robots" content="noindex, nofollow" /> : null}
        <link rel="canonical" href={canonical} />
        {favicon ? (
          <>
            <link rel="icon" type="image/png" sizes="32x32" href={faviconUrl(favicon, 32)} />
            <link rel="apple-touch-icon" href={faviconUrl(favicon, 180)} />
          </>
        ) : (
          // Geen upload: een automatisch icoon in de merkkleur, als data-URI (geen extra aanvraag). Nooit het icoon van het platform.
          <link rel="icon" type="image/svg+xml" href={fallbackFaviconDataUri(name, theme)} />
        )}
        <meta property="og:title" content={title} />
        {description ? <meta property="og:description" content={description} /> : null}
        <meta property="og:site_name" content={name} />
        <meta property="og:type" content="website" />
        {image ? <meta property="og:image" content={image} /> : null}
        <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={title} />
        {description ? <meta name="twitter:description" content={description} /> : null}
        {image ? <meta name="twitter:image" content={image} /> : null}
        <style dangerouslySetInnerHTML={{ __html: siteCss() }} />
        <ThemeFonts theme={theme} />
      </head>
      <body>
        <div style={{ ...themeToCssVars(theme), background: "var(--var-color-white)", minHeight: "100vh" }}>
          <SiteFrame
            header={layout.header.length > 0 ? <BlockRenderer sections={layout.header} /> : null}
            footer={layout.footer.length > 0 ? <BlockRenderer sections={layout.footer} /> : null}
          >
            <BlockRenderer sections={page.sections} />
          </SiteFrame>
        </div>
        {scripts.map((s) => (
          <script key={s.id} type="module" src={enhancementUrl(s)} />
        ))}
      </body>
    </html>
  );
}

// Een onbekende host, een site die niet online staat of een pagina die niet bestaat.
function NotFoundDocument(): ReactElement {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Pagina niet gevonden</title>
      </head>
      <body style={{ margin: 0 }}>
        <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "2rem", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Pagina niet gevonden</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Deze pagina bestaat niet of staat nog niet online.</p>
          </div>
        </main>
      </body>
    </html>
  );
}

const HEADERS = { "content-type": "text/html; charset=utf-8" };

async function toResponse(document: ReactElement, status: number): Promise<Response> {
  const { prelude } = await prerender(document);
  return new Response(prelude, { status, headers: HEADERS });
}

export const renderSitePage = (site: PublicSite, page: Page) => toResponse(<SiteDocument site={site} page={page} />, 200);
export const renderSiteNotFound = () => toResponse(<NotFoundDocument />, 404);
