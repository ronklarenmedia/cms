import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import type { GalleryContent, GallerySettings, GalleryVariant } from "./schema";

export function Gallery({ variant, content, settings }: BlockProps<GalleryVariant, GalleryContent, GallerySettings>) {
  const { eyebrow, heading, intro, images } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);

  return (
    <div className={`blk-gallery blk-gallery--${variant} blk-gallery--cols-${settings.columns} blk-gallery--aspect-${settings.aspect}`}>
      {hasHeader && (
        <header className="blk-gallery__header">
          {eyebrow && <p className="blk-gallery__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-gallery__heading">{heading}</h2>}
          {intro && <p className="blk-gallery__intro">{intro}</p>}
        </header>
      )}

      <ul className="blk-gallery__grid">
        {images.map((item, idx) => (
          <li key={`${item.image.url}-${idx}`} className="blk-gallery__item">
            <figure className="blk-gallery__figure">
              <Img image={item.image} />
              {item.caption && <figcaption className="blk-gallery__caption">{item.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
