import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import { Img } from "../parts/Img";
import type { SiteHeaderContent, SiteHeaderSettings, SiteHeaderVariant } from "./schema";

type Links = SiteHeaderContent["links"];

/** De linklijst; twee keer gebruikt: als balk (desktop) en als gestapeld menu (mobiel, in <details>). */
function NavList({ links, layout }: { links: Links; layout: "bar" | "stack" }) {
  return (
    <ul className={`blk-site-header__list blk-site-header__list--${layout}`}>
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`} className="blk-site-header__item">
          <a className="blk-site-header__link" href={link.href}>
            {link.label}
          </a>
          {link.children.length > 0 && (
            <ul className="blk-site-header__sub">
              {link.children.map((child) => (
                <li key={`${child.label}-${child.href}`}>
                  <a className="blk-site-header__sublink" href={child.href}>
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

// De omringende <header> komt van de site-frame (die zorgt voor de landmarks); dit block rendert alleen de inhoud.
export function SiteHeader({ variant, content }: BlockProps<SiteHeaderVariant, SiteHeaderContent, SiteHeaderSettings>) {
  const { brand, logo, links, button } = content;
  const cta = button ? [button] : [];
  return (
    <div className={`blk-site-header blk-site-header--${variant}`}>
      {/* Blocks blijven framework-onafhankelijk (geen next/link): een gewone <a> is hier de bedoeling. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="blk-site-header__brand" href="/">
        {logo && <Img image={logo} priority />}
        <span className="blk-site-header__brand-name">{brand}</span>
      </a>

      {links.length > 0 && (
        <nav className="blk-site-header__nav" aria-label="Hoofdmenu">
          <NavList links={links} layout="bar" />
        </nav>
      )}
      <div className="blk-site-header__cta">
        <Buttons buttons={cta} />
      </div>

      {/* Mobiel menu zonder JavaScript: <details> klapt open en dicht. */}
      {(links.length > 0 || button) && (
        <details className="blk-site-header__menu">
          <summary className="blk-site-header__toggle">Menu</summary>
          <div className="blk-site-header__panel">
            {links.length > 0 && (
              <nav aria-label="Mobiel menu">
                <NavList links={links} layout="stack" />
              </nav>
            )}
            <Buttons buttons={cta} />
          </div>
        </details>
      )}
    </div>
  );
}
