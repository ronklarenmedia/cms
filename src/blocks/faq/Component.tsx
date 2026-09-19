import type { BlockProps } from "../contract";
import { JsonLd } from "../parts/JsonLd";
import type { FaqContent, FaqSettings, FaqVariant } from "./schema";

export function Faq({
  variant,
  content,
}: BlockProps<FaqVariant, FaqContent, FaqSettings>) {
  const { eyebrow, heading, intro, items, button } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const QuestionHeading = heading ? "h3" : "h2";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className={`blk-faq blk-faq--${variant}`}>
      <JsonLd data={jsonLdData} />
      {hasHeader && (
        <header className="blk-faq__header">
          {eyebrow && <p className="blk-faq__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-faq__heading">{heading}</h2>}
          {intro && <p className="blk-faq__intro">{intro}</p>}
        </header>
      )}

      {variant === "accordion" ? (
        <div className="blk-faq__accordion">
          {items.map((item, index) => (
            <details key={`${item.question.slice(0, 20)}-${index}`} className="blk-faq__item" open={index === 0}>
              <summary className="blk-faq__question">
                <QuestionHeading className="blk-faq__question-title">{item.question}</QuestionHeading>
                <span className="blk-faq__icon" aria-hidden="true" />
              </summary>
              <div className="blk-faq__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="blk-faq__grid">
          {items.map((item, index) => (
            <article key={`${item.question.slice(0, 20)}-${index}`} className="blk-faq__card">
              <QuestionHeading className="blk-faq__card-title">{item.question}</QuestionHeading>
              <p className="blk-faq__card-answer">{item.answer}</p>
            </article>
          ))}
        </div>
      )}

      {button && (
        <footer className="blk-faq__footer">
          <a className={`blk-btn blk-btn--${button.style}`} href={button.href}>
            {button.label}
          </a>
        </footer>
      )}
    </div>
  );
}
