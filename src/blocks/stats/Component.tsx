import type { BlockProps } from "../contract";
import type { StatsContent, StatsSettings, StatsVariant } from "./schema";

export function Stats({ variant, content, settings }: BlockProps<StatsVariant, StatsContent, StatsSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = eyebrow || heading || intro;
  return (
    <div className={`blk-stats blk-stats--${variant} blk-stats--cols-${settings.columns}`}>
      {hasHeader && (
        <header className="blk-stats__header">
          {eyebrow && <p className="blk-stats__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-stats__heading">{heading}</h2>}
          {intro && <p className="blk-stats__intro">{intro}</p>}
        </header>
      )}
      <ul className="blk-stats__items">
        {items.map((item) => (
          <li key={`${item.value}-${item.label}`} className="blk-stats__item">
            <span className="blk-stats__value">{item.value}</span>
            <span className="blk-stats__label">{item.label}</span>
            {item.description && <p className="blk-stats__description">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
