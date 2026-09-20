import type { BlockProps } from "../contract";
import type { TimelineContent, TimelineSettings, TimelineVariant } from "./schema";

export function Timeline({ variant, content }: BlockProps<TimelineVariant, TimelineContent, TimelineSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  // Heeft het block geen eigen h2, dan zijn de momenten zelf de h2's.
  const ItemHeading = heading ? "h3" : "h2";

  return (
    <div className={`blk-timeline blk-timeline--${variant}`}>
      {hasHeader && (
        <header className="blk-timeline__header">
          {eyebrow && <p className="blk-timeline__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-timeline__heading">{heading}</h2>}
          {intro && <p className="blk-timeline__intro">{intro}</p>}
        </header>
      )}

      <ol className="blk-timeline__list">
        {items.map((item, idx) => (
          <li key={`${item.date}-${idx}`} className="blk-timeline__item">
            <span className="blk-timeline__date">{item.date}</span>
            <ItemHeading className="blk-timeline__title">{item.title}</ItemHeading>
            {item.text && <p className="blk-timeline__text">{item.text}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
