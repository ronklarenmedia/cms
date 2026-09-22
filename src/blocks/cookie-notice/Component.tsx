import type { BlockProps } from "../contract";
import type { CookieNoticeContent, CookieNoticeSettings, CookieNoticeVariant } from "./schema";

/**
 * Staat altijd op de eerste weergave (zonder JavaScript blijft hij gewoon zichtbaar op elke pagina; dat is de
 * veilige, correcte staat). Met JavaScript (src/lib/enhancements.ts, public/enhance/v1/cookie-notice.js) onthoudt
 * een klik op "Akkoord" de keuze (localStorage) en verdwijnt de melding op volgende pagina's.
 */
export function CookieNotice({ variant, content }: BlockProps<CookieNoticeVariant, CookieNoticeContent, CookieNoticeSettings>) {
  const { heading, body, acceptLabel, link } = content;
  return (
    <div className={`blk-cookie-notice blk-cookie-notice--${variant}`} data-cookie-notice>
      <div className="blk-cookie-notice__text">
        <p className="blk-cookie-notice__heading">{heading}</p>
        <p className="blk-cookie-notice__body">
          {body} {link && (
            <a className="blk-cookie-notice__link" href={link.href}>
              {link.label}
            </a>
          )}
        </p>
      </div>
      <button type="button" className="blk-cookie-notice__accept">
        {acceptLabel}
      </button>
    </div>
  );
}
