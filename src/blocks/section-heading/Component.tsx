import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import type { SectionHeadingContent, SectionHeadingSettings, SectionHeadingVariant } from "./schema";

export function SectionHeading({
  variant,
  content,
}: BlockProps<SectionHeadingVariant, SectionHeadingContent, SectionHeadingSettings>) {
  const { eyebrow, heading, intro, buttons } = content;
  return (
    <div className={`blk-section-heading blk-section-heading--${variant}`}>
      <div className="blk-section-heading__header">
        {eyebrow && <p className="blk-section-heading__eyebrow">{eyebrow}</p>}
        <h2 className="blk-section-heading__heading">{heading}</h2>
      </div>
      {(intro || (buttons && buttons.length > 0)) && (
        <div className="blk-section-heading__aside">
          {intro && <p className="blk-section-heading__intro">{intro}</p>}
          {buttons && <Buttons buttons={buttons} />}
        </div>
      )}
    </div>
  );
}
