import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import { Img } from "../parts/Img";
import type { HeroContent, HeroSettings, HeroVariant } from "./schema";

// De Hero is de enige sectie met een <h1>; alle andere blocks beginnen bij <h2>.
export function Hero({ variant, content, settings }: BlockProps<HeroVariant, HeroContent, HeroSettings>) {
  const { eyebrow, heading, body, buttons, media } = content;
  return (
    <div className={`blk-hero blk-hero--${variant} blk-hero--h-${settings.height}`}>
      <div className="blk-hero__text">
        {eyebrow && <p className="blk-hero__eyebrow">{eyebrow}</p>}
        <h1 className="blk-hero__heading">{heading}</h1>
        {body && <p className="blk-hero__body">{body}</p>}
        <Buttons buttons={buttons} />
      </div>
      {media && (
        <div className="blk-hero__media">
          <Img image={media} priority />
        </div>
      )}
    </div>
  );
}
