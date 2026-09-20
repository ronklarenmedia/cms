import type { ReactNode } from "react";
import "./site-frame.css";

/**
 * De pagina-opbouw van een site: header, hoofdinhoud en footer als echte landmarks (<header>, <main>, <footer>),
 * zodat schermlezers en zoekmachines de structuur herkennen. Gebruikt door het voorbeeld en de builder.
 * `embedded`: gewone <div>'s, voor gebruik binnen het platform zelf (dat al een <main> heeft).
 */
export function SiteFrame({
  header,
  children,
  footer,
  embedded = false,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  embedded?: boolean;
}) {
  const Header = embedded ? "div" : "header";
  const Main = embedded ? "div" : "main";
  const Footer = embedded ? "div" : "footer";
  return (
    <>
      {header ? <Header className="site-frame__header">{header}</Header> : null}
      <Main>{children}</Main>
      {footer ? <Footer>{footer}</Footer> : null}
    </>
  );
}
