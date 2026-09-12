// Zet een site.theme-object (uit Payload) om naar CSS custom properties.
// Dit is de "Lokaal"-laag uit de niveauhiërarchie: kleuren/fonts/randen/
// radius/paginaformaat, straks nog aan te vullen met de exacte velden
// zodra het Payload-schema definitief is.

export type SiteTheme = {
  colors?: Record<string, string>;
  fonts?: { heading?: string; body?: string };
  borderRadius?: string;
  maxPageWidth?: string;
};

export function themeToCssVars(theme: SiteTheme = {}): string {
  const lines: string[] = [];

  for (const [name, value] of Object.entries(theme.colors ?? {})) {
    lines.push(`--color-${name}: ${value};`);
  }
  if (theme.fonts?.heading) lines.push(`--font-heading: ${theme.fonts.heading};`);
  if (theme.fonts?.body) lines.push(`--font-body: ${theme.fonts.body};`);
  if (theme.borderRadius) lines.push(`--radius: ${theme.borderRadius};`);
  if (theme.maxPageWidth) lines.push(`--page-max-width: ${theme.maxPageWidth};`);

  return `:root {\n  ${lines.join("\n  ")}\n}`;
}
