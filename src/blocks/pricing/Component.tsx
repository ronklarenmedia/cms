import type { BlockProps } from "../contract";
import { JsonLd } from "../parts/JsonLd";
import type { PricingContent, PricingSettings, PricingVariant } from "./schema";

export function Pricing({
  variant,
  content,
}: BlockProps<PricingVariant, PricingContent, PricingSettings>) {
  const { eyebrow, heading, intro, plans } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const PlanHeading = heading ? "h3" : "h2";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: plans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
        price: plan.price.replace(/[^\d.,]/g, ""),
        priceCurrency: "EUR",
      },
    })),
  };

  return (
    <div className={`blk-pricing blk-pricing--${variant} blk-pricing--count-${plans.length}`}>
      <JsonLd data={jsonLdData} />
      {hasHeader && (
        <header className="blk-pricing__header">
          {eyebrow && <p className="blk-pricing__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-pricing__heading">{heading}</h2>}
          {intro && <p className="blk-pricing__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-pricing__grid">
        {plans.map((plan, idx) => {
          const isHighlighted = variant === "highlighted" ? plan.highlighted || idx === 1 : plan.highlighted;
          return (
            <article
              key={`${plan.name}-${idx}`}
              className={`blk-pricing__card ${isHighlighted ? "blk-pricing__card--highlighted" : ""}`}
            >
              {plan.badge && <span className="blk-pricing__badge">{plan.badge}</span>}
              <div className="blk-pricing__card-head">
                <PlanHeading className="blk-pricing__plan-name">{plan.name}</PlanHeading>
                {plan.description && <p className="blk-pricing__plan-desc">{plan.description}</p>}
              </div>

              <div className="blk-pricing__price-box">
                <span className="blk-pricing__price">{plan.price}</span>
                {plan.period && <span className="blk-pricing__period">{plan.period}</span>}
              </div>

              <ul className="blk-pricing__features">
                {plan.features.map((feature, fIdx) => (
                  <li key={`${feature.slice(0, 15)}-${fIdx}`} className="blk-pricing__feature">
                    <span className="blk-pricing__check" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="blk-pricing__action">
                <a
                  className={`blk-btn blk-btn--${plan.button.style}`}
                  href={plan.button.href}
                >
                  {plan.button.label}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
