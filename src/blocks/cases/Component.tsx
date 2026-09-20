import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import type { CasesContent, CasesSettings, CasesVariant } from "./schema";

export function Cases({ variant, content, settings }: BlockProps<CasesVariant, CasesContent, CasesSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const ItemHeading = heading ? "h3" : "h2";

  return (
    <div className={`blk-cases blk-cases--${variant} blk-cases--cols-${settings.columns} blk-cases--aspect-${settings.aspect}`}>
      {hasHeader && (
        <header className="blk-cases__header">
          {eyebrow && <p className="blk-cases__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-cases__heading">{heading}</h2>}
          {intro && <p className="blk-cases__intro">{intro}</p>}
        </header>
      )}

      <ul className="blk-cases__grid">
        {items.map((item, idx) => (
          <li key={`${item.title}-${idx}`} className="blk-cases__item">
            <article className="blk-cases__card">
              <div className="blk-cases__media">
                <Img image={item.image} />
              </div>
              <div className="blk-cases__body">
                {item.client && <p className="blk-cases__client">{item.client}</p>}
                <ItemHeading className="blk-cases__title">
                  {item.href ? (
                    <a className="blk-cases__link" href={item.href}>
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </ItemHeading>
                {item.summary && <p className="blk-cases__summary">{item.summary}</p>}
                {item.tags.length > 0 && (
                  <ul className="blk-cases__tags">
                    {item.tags.map((tag) => (
                      <li key={tag} className="blk-cases__tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                {item.href && (
                  <span className="blk-cases__more" aria-hidden="true">
                    {item.cta ?? "Bekijk de case"} →
                  </span>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
