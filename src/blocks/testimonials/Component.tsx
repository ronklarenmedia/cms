import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import { JsonLd } from "../parts/JsonLd";
import type { TestimonialsContent, TestimonialsSettings, TestimonialsVariant } from "./schema";

export function Testimonials({
  variant,
  content,
  settings,
}: BlockProps<TestimonialsVariant, TestimonialsContent, TestimonialsSettings>) {
  const { eyebrow, heading, intro, items } = content;
  const hasHeader = eyebrow || heading || intro;
  const ItemHeading = heading ? "h3" : "h2";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Review",
        reviewBody: item.quote,
        author: {
          "@type": "Person",
          name: item.name,
          ...(item.role ? { jobTitle: item.role } : {}),
        },
        ...(item.rating
          ? {
              reviewRating: {
                "@type": "Rating",
                ratingValue: item.rating,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
    })),
  };

  return (
    <div className={`blk-testimonials blk-testimonials--${variant} blk-testimonials--cols-${settings.columns}`}>
      <JsonLd data={jsonLdData} />
      {hasHeader && (
        <header className="blk-testimonials__header">
          {eyebrow && <p className="blk-testimonials__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-testimonials__heading">{heading}</h2>}
          {intro && <p className="blk-testimonials__intro">{intro}</p>}
        </header>
      )}
      <ul className="blk-testimonials__items">
        {items.map((item) => (
          <li key={`${item.name}-${item.quote.slice(0, 15)}`} className="blk-testimonials__item">
            <figure className="blk-testimonials__figure">
              {item.rating && (
                <div className="blk-testimonials__rating" role="img" aria-label={`${item.rating} van 5 sterren`}>
                  <span aria-hidden="true">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </span>
                </div>
              )}
              <blockquote className="blk-testimonials__quote">
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption className="blk-testimonials__author">
                {item.avatar && (
                  <div className="blk-testimonials__avatar">
                    <Img image={item.avatar} />
                  </div>
                )}
                <div className="blk-testimonials__meta">
                  <ItemHeading className="blk-testimonials__name">{item.name}</ItemHeading>
                  {item.role && <p className="blk-testimonials__role">{item.role}</p>}
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
