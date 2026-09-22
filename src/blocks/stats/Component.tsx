import type { BlockProps } from "../contract";
import { Icon } from "../parts/Icon";
import type { StatsContent, StatsSettings, StatsVariant } from "./schema";

type Props = BlockProps<StatsVariant, StatsContent, StatsSettings> & {
  /** Iconnaam → gesaneerde SVG-markup (src/lib/material-icons.ts); alleen hiervoor wordt icon als opmaak gerenderd. */
  icons?: Record<string, string>;
};

// "colorBgPrimaryLight" → "bg-primary-light", voor de klassennamen in styles.css (--fg-/--bd-/--fill-<slug>).
const colorSlug = (token: string) => token.slice("color".length).replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export function Stats({ variant, content, settings, icons = {} }: Props) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = eyebrow || heading || intro;
  const framed = settings.iconStyle === "framed";
  const iconClass = [
    "blk-stats__icon",
    `blk-stats__icon--fg-${colorSlug(settings.iconColor)}`,
    framed && "blk-stats__icon--framed",
    framed && `blk-stats__icon--border-${settings.iconBorderWidth}`,
    framed && `blk-stats__icon--radius-${settings.iconRadius}`,
    framed && `blk-stats__icon--bd-${colorSlug(settings.iconBorderColor)}`,
    framed && `blk-stats__icon--fill-${colorSlug(settings.iconBackgroundColor)}`,
  ]
    .filter(Boolean)
    .join(" ");
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
            {item.icon && icons[item.icon] ? (
              <Icon svg={icons[item.icon]} className={iconClass} />
            ) : item.icon ? (
              <span className={iconClass} aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="blk-stats__value">{item.value}</span>
            <span className="blk-stats__label">{item.label}</span>
            {item.description && <p className="blk-stats__description">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
