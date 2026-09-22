import type { SiteTheme } from "@/blocks/theme";
import type { HostedFont } from "@/db/schema";
import { fontFaceCss, themeFonts } from "./fonts";

/**
 * Levert de webfonts van een thema mee: de @font-face-regels en een preload voor het kop- en tekstlettertype. Rendert niets als het thema alleen
 * systeemlettertypes gebruikt. Geen hooks, dus bruikbaar in server- en clientcomponenten; React 19 tilt `<style href precedence>` en
 * `<link rel="preload">` zelf naar de <head> (en dedupliceert op `href`). `hosted`: on-demand gehoste Google Fonts (src/lib/google-fonts.ts)
 * die het thema gebruikt — uit de momentopname bij een openbare pagina, of een live query in de bouwer/het voorbeeld.
 */
export function ThemeFonts({ theme, hosted = [] }: { theme: SiteTheme; hosted?: HostedFont[] }) {
  const { used, preload } = themeFonts(theme, hosted);
  if (used.length === 0) return null;
  return (
    <>
      {preload.map((f) => (
        <link key={f.key} rel="preload" as="font" type="font/woff2" href={f.url} crossOrigin="anonymous" />
      ))}
      <style href={`fonts-${used.map((f) => f.key).join("+")}`} precedence="default">
        {fontFaceCss(used)}
      </style>
    </>
  );
}
