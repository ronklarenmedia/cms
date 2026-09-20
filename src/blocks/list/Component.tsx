import type { BlockProps } from "../contract";
import type { ListContent, ListSettings, ListVariant } from "./schema";

export function List({ variant, content }: BlockProps<ListVariant, ListContent, ListSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const detailed = variant === "detailed";
  // Titels zijn alleen bij "Uitgebreid" een kop; in de simpele lijst zijn het gewone rijen.
  const ItemTitle = detailed ? (heading ? "h3" : "h2") : "span";

  return (
    <div className={`blk-list blk-list--${variant}`}>
      {hasHeader && (
        <header className="blk-list__header">
          {eyebrow && <p className="blk-list__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-list__heading">{heading}</h2>}
          {intro && <p className="blk-list__intro">{intro}</p>}
        </header>
      )}

      <ul className="blk-list__items">
        {items.map((item, idx) => (
          <li key={`${item.title}-${idx}`} className="blk-list__item">
            {detailed && item.tag && <span className="blk-list__tag">{item.tag}</span>}
            <div className="blk-list__main">
              <ItemTitle className="blk-list__title">
                {item.href ? (
                  <a className="blk-list__link" href={item.href}>
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </ItemTitle>
              {detailed && item.text && <p className="blk-list__text">{item.text}</p>}
            </div>
            {!detailed && item.tags.length > 0 && (
              <ul className="blk-list__tags">
                {item.tags.map((tag) => (
                  <li key={tag} className="blk-list__chip">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {item.href && (
              <span className="blk-list__arrow" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
