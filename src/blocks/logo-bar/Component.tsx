import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import type { LogoBarContent, LogoBarSettings, LogoBarVariant } from "./schema";

export function LogoBar({ variant, content }: BlockProps<LogoBarVariant, LogoBarContent, LogoBarSettings>) {
  const { eyebrow, heading, logos } = content;
  const hasHeader = eyebrow || heading;
  return (
    <div className={`blk-logo-bar blk-logo-bar--${variant}`}>
      {hasHeader && (
        <header className="blk-logo-bar__header">
          {eyebrow && <p className="blk-logo-bar__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-logo-bar__heading">{heading}</h2>}
        </header>
      )}
      <ul className="blk-logo-bar__items">
        {logos.map((logo) => {
          const itemContent = (
            <>
              <Img image={logo.image} />
              <span className="blk-logo-bar__sr-only">{logo.name}</span>
            </>
          );
          return (
            <li key={logo.name} className="blk-logo-bar__item">
              {logo.href ? (
                <a href={logo.href} className="blk-logo-bar__link">
                  {itemContent}
                </a>
              ) : (
                <div className="blk-logo-bar__wrapper">{itemContent}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
