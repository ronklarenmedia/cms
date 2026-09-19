import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import type { CtaBannerContent, CtaBannerSettings, CtaBannerVariant } from "./schema";

export function CtaBanner({ variant, content }: BlockProps<CtaBannerVariant, CtaBannerContent, CtaBannerSettings>) {
  const { heading, body, buttons } = content;
  return (
    <div className={`blk-cta-banner blk-cta-banner--${variant}`}>
      <div className="blk-cta-banner__text">
        <h2 className="blk-cta-banner__heading">{heading}</h2>
        {body && <p className="blk-cta-banner__body">{body}</p>}
      </div>
      <Buttons buttons={buttons} />
    </div>
  );
}
