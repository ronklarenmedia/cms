/**
 * Een on-demand gehost Material Symbol (src/lib/material-icons.ts), als inline SVG. De enige andere plek in de
 * blocks waar dangerouslySetInnerHTML is toegestaan: alleen voor `svg`-waarden die de server al heeft opgehaald,
 * gesaneerd (alleen <svg>/<path>, alleen d/viewBox/fill) en per iconnaam heeft meegegeven — nooit voor vrije tekst
 * uit een veld. Rendert niets als er geen SVG voor deze naam is (bijv. een vrij getypt emoji): de aanroeper toont dan
 * de tekst zelf.
 */
export function Icon({ svg, className }: { svg: string; className?: string }) {
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
