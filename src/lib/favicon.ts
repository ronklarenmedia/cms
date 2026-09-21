import type { SiteTheme } from "@/blocks/theme";
import { fullTheme } from "./theme-tokens";

// Het favicon van een klantsite. Geüpload = twee PNG's (32 en 180 px) onder een basis-URL (storeFavicon in src/lib/media.ts). Zonder upload
// krijgt de site een automatisch icoon in zijn merkkleur met de beginletter, zodat een klantsite nooit het icoon van het platform toont.
// Pure functies zonder server-afhankelijkheden: ook bruikbaar in de builder (voorbeeld in het dialoog).

/** Formaten van een favicon: 32 px voor het tabblad, 180 px voor het beginscherm van een telefoon (apple-touch-icon). */
export const FAVICON_SIZES = [32, 180] as const;

/**
 * Het adres (zonder punt, zodat de proxy het herschrijft) waarop een klantsite zijn favicon serveert. `/favicon.ico` van een openbare host
 * wordt daarheen herschreven (src/proxy.ts): browsers en crawlers vragen dat pad ongevraagd, en anders kregen ze het platform-icoon.
 * Een pagina met deze naam zou het overschaduwen; zie RESERVED_PAGE_SLUGS.
 */
export const FAVICON_PATH = "site-favicon";
export const RESERVED_PAGE_SLUGS: readonly string[] = [FAVICON_PATH];

export const faviconUrl = (base: string, size: (typeof FAVICON_SIZES)[number]) => `${base.replace(/\/+$/, "")}/${size}.png`;

const DEFAULT_BACKGROUND = "#4338ca";

/** Een geldige hex-kleur als #rrggbb, of null (namen, rgb() en dergelijke laten we hier liggen). */
function hex(value: string | number | undefined): string | null {
  const v = String(value ?? "").trim();
  const long = v.match(/^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i);
  if (long) return `#${long[1].toLowerCase()}`;
  const short = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  return short ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase() : null;
}

/** Relatieve helderheid (0 = zwart, 1 = wit), voor de keuze tussen een lichte en een donkere letter. */
function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const escapeXml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

/** Het automatische icoon: een afgeronde tegel in de primaire kleur van de site met de beginletter van de sitenaam, in de best leesbare tint. */
export function fallbackFaviconSvg(siteName: string, theme: SiteTheme): string {
  const t = fullTheme(theme);
  const background = hex(t.colorPrimary) ?? DEFAULT_BACKGROUND;
  const light = hex(t.colorWhite) ?? "#ffffff";
  const dark = hex(t.colorText) ?? "#18181b";
  const letter = escapeXml([...siteName.trim()][0]?.toUpperCase() ?? "•");
  const ink = luminance(background) > 0.5 ? dark : light;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${background}"/>` +
    `<text x="32" y="32" dy=".35em" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="38" font-weight="700" fill="${ink}">${letter}</text></svg>`
  );
}

/** Het automatische icoon als data-URI, om zonder extra aanvraag in de <head> te zetten. */
export const fallbackFaviconDataUri = (siteName: string, theme: SiteTheme) => `data:image/svg+xml,${encodeURIComponent(fallbackFaviconSvg(siteName, theme))}`;
