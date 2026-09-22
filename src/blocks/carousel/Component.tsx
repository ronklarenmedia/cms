import type { BlockProps } from "../contract";
import { hashId } from "../parts/hashId";
import { Img } from "../parts/Img";
import type { CarouselContent, CarouselSettings, CarouselVariant } from "./schema";

export function Carousel({ variant, content }: BlockProps<CarouselVariant, CarouselContent, CarouselSettings>) {
  const { eyebrow, heading, intro, slides } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const gid = hashId(slides.map((s) => s.image.url).join("|"));
  const slideId = (idx: number) => `carousel-${gid}-${idx}`;

  return (
    <div className={`blk-carousel blk-carousel--${variant}`}>
      {hasHeader && (
        <header className="blk-carousel__header">
          {eyebrow && <p className="blk-carousel__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-carousel__heading">{heading}</h2>}
          {intro && <p className="blk-carousel__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-carousel__track">
        {slides.map((slide, idx) => (
          <div key={idx} id={slideId(idx)} className="blk-carousel__slide">
            <Img image={slide.image} />
            {(slide.heading || slide.text) && (
              <div className="blk-carousel__caption">
                {slide.heading && <p className="blk-carousel__caption-heading">{slide.heading}</p>}
                {slide.text && <p className="blk-carousel__caption-text">{slide.text}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="blk-carousel__nav">
        {slides.map((_, idx) => (
          <a key={idx} href={`#${slideId(idx)}`} className="blk-carousel__dot">
            <span className="blk-carousel__sr-only">Naar dia {idx + 1}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
