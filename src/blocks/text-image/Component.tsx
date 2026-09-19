import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import { Img } from "../parts/Img";
import type { TextImageContent, TextImageSettings, TextImageVariant } from "./schema";

export function TextImage({
  variant,
  content,
  settings,
}: BlockProps<TextImageVariant, TextImageContent, TextImageSettings>) {
  const { eyebrow, heading, body, buttons, image } = content;
  return (
    <div className={`blk-text-image blk-text-image--${variant} blk-text-image--ratio-${settings.imageRatio}`}>
      <div className="blk-text-image__text">
        {eyebrow && <p className="blk-text-image__eyebrow">{eyebrow}</p>}
        <h2 className="blk-text-image__heading">{heading}</h2>
        {body && <p className="blk-text-image__body">{body}</p>}
        {buttons && buttons.length > 0 && <Buttons buttons={buttons} />}
      </div>
      <div className="blk-text-image__media">
        <Img image={image} />
      </div>
    </div>
  );
}
