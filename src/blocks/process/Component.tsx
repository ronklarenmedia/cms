import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import { JsonLd } from "../parts/JsonLd";
import type { ProcessContent, ProcessSettings, ProcessVariant } from "./schema";

export function Process({
  variant,
  content,
}: BlockProps<ProcessVariant, ProcessContent, ProcessSettings>) {
  const { eyebrow, heading, intro, steps, buttons = [] } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const StepHeading = heading ? "h3" : "h2";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: heading || "Werkwijze",
    description: intro,
    step: steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <div className={`blk-process blk-process--${variant} blk-process--count-${steps.length}`}>
      <JsonLd data={jsonLdData} />
      {hasHeader && (
        <header className="blk-process__header">
          {eyebrow && <p className="blk-process__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-process__heading">{heading}</h2>}
          {intro && <p className="blk-process__intro">{intro}</p>}
        </header>
      )}

      <ol className="blk-process__steps">
        {steps.map((step, idx) => (
          <li key={`${step.number}-${idx}`} className="blk-process__step">
            <div className="blk-process__marker-wrap">
              <span className="blk-process__number">{step.number}</span>
              {idx < steps.length - 1 && <span className="blk-process__line" aria-hidden="true" />}
            </div>
            <div className="blk-process__body">
              {step.tag && <span className="blk-process__tag">{step.tag}</span>}
              <StepHeading className="blk-process__step-title">{step.title}</StepHeading>
              <p className="blk-process__step-desc">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {buttons.length > 0 && (
        <div className="blk-process__footer">
          <Buttons buttons={buttons} />
        </div>
      )}
    </div>
  );
}
