import type { BlockProps } from "../contract";
import type { SiteFooterContent, SiteFooterSettings, SiteFooterVariant } from "./schema";

// De omringende <footer> komt van de site-frame (die zorgt voor de landmarks); dit block rendert alleen de inhoud.
// Kolomtitels zijn geen koppen: een footer hoort de kopstructuur van de pagina niet te vervuilen.
export function SiteFooter({ variant, content }: BlockProps<SiteFooterVariant, SiteFooterContent, SiteFooterSettings>) {
  const { brand, description, columns, contact, legalLinks, copyright } = content;
  const hasContact = contact && (contact.email || contact.phone || contact.address);
  const allLinks = columns.flatMap((c) => c.links);

  return (
    <div className={`blk-site-footer blk-site-footer--${variant}`}>
      <div className="blk-site-footer__main">
        <div className="blk-site-footer__about">
          <p className="blk-site-footer__brand">{brand}</p>
          {description && <p className="blk-site-footer__description">{description}</p>}
          {hasContact && (
            <address className="blk-site-footer__contact">
              {contact.address && <span className="blk-site-footer__address">{contact.address}</span>}
              {contact.email && (
                <a className="blk-site-footer__contact-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a className="blk-site-footer__contact-link" href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                  {contact.phone}
                </a>
              )}
            </address>
          )}
        </div>

        {variant === "columns" &&
          columns.map((column) => (
            <nav key={column.title} className="blk-site-footer__column" aria-label={column.title}>
              <p className="blk-site-footer__column-title">{column.title}</p>
              <ul className="blk-site-footer__links">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a className="blk-site-footer__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        {variant === "simple" && allLinks.length > 0 && (
          <nav className="blk-site-footer__column" aria-label="Footermenu">
            <ul className="blk-site-footer__links blk-site-footer__links--row">
              {allLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a className="blk-site-footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {(copyright || legalLinks.length > 0) && (
        <div className="blk-site-footer__bottom">
          {copyright && <p className="blk-site-footer__copyright">{copyright}</p>}
          {legalLinks.length > 0 && (
            <nav aria-label="Juridische links">
              <ul className="blk-site-footer__links blk-site-footer__links--row">
                {legalLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a className="blk-site-footer__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
