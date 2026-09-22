import type { BlockProps } from "../contract";
import { hashId } from "../parts/hashId";
import type { TabsContent, TabsSettings, TabsVariant } from "./schema";

export function Tabs({ variant, content }: BlockProps<TabsVariant, TabsContent, TabsSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const gid = hashId(items.map((i) => i.label).join("|"));

  return (
    <div className={`blk-tabs blk-tabs--${variant}`}>
      {hasHeader && (
        <header className="blk-tabs__header">
          {eyebrow && <p className="blk-tabs__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-tabs__heading">{heading}</h2>}
          {intro && <p className="blk-tabs__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-tabs__inner">
        {items.map((item, idx) => (
          <input
            key={`input-${idx}`}
            type="radio"
            className="blk-tabs__input"
            name={`tabs-${gid}`}
            id={`tabs-${gid}-${idx}`}
            defaultChecked={idx === 0}
          />
        ))}
        {items.map((item, idx) => (
          <label key={`label-${idx}`} className="blk-tabs__label" htmlFor={`tabs-${gid}-${idx}`}>
            {item.label}
          </label>
        ))}
        <div className="blk-tabs__panels">
          {items.map((item, idx) => (
            <div key={`panel-${idx}`} className="blk-tabs__panel">
              {item.heading && <h3 className="blk-tabs__panel-heading">{item.heading}</h3>}
              <p className="blk-tabs__panel-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
