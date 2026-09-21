import type { SiteTheme } from "@/blocks/theme";
import { fontFaceCss, fontUrl, themeFonts } from "./fonts";

/**
 * Levert de webfonts van een thema mee: de @font-face-regels en een preload voor het kop- en tekstlettertype. Rendert niets als het thema alleen
 * systeemlettertypes gebruikt. Geen hooks, dus bruikbaar in server- en clientcomponenten; React 19 tilt `<style href precedence>` en
 * `<link rel="preload">` zelf naar de <head> (en dedupliceert op `href`).
 */
export function ThemeFonts({ theme }: { theme: SiteTheme }) {
  const { used, preload } = themeFonts(theme);
  if (used.length === 0) return null;
  return (
    <>
      {preload.map((f) => (
        <link key={f.id} rel="preload" as="font" type="font/woff2" href={fontUrl(f)} crossOrigin="anonymous" />
      ))}
      <style href={`fonts-${used.map((f) => f.id).join("+")}`} precedence="default">
        {fontFaceCss(used)}
      </style>
    </>
  );
}
