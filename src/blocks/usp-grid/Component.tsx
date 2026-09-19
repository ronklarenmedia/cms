import type { BlockProps } from "../contract";
import type { UspGridContent, UspGridSettings, UspGridVariant } from "./schema";

export function UspGrid({ variant, content, settings }: BlockProps<UspGridVariant, UspGridContent, UspGridSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = eyebrow || heading || intro;
  // Zonder sectiekop staan de items direct onder de vorige sectie: dan h2, anders h3.
  const ItemHeading = heading ? "h3" : "h2";
  return (
    <div className={`blk-usp-grid blk-usp-grid--${variant} blk-usp-grid--cols-${settings.columns}`}>
      {hasHeader && (
        <header className="blk-usp-grid__header">
          {eyebrow && <p className="blk-usp-grid__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-usp-grid__heading">{heading}</h2>}
          {intro && <p className="blk-usp-grid__intro">{intro}</p>}
        </header>
      )}
      <ul className="blk-usp-grid__items">
        {items.map((item) => (
          <li key={item.heading} className="blk-usp-grid__item">
            {item.icon && (
              <span className="blk-usp-grid__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <ItemHeading className="blk-usp-grid__item-heading">{item.heading}</ItemHeading>
            {item.text && <p className="blk-usp-grid__text">{item.text}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
