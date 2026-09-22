import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import { Img } from "../parts/Img";
import type { HeroContent, HeroSettings, HeroVariant } from "./schema";

// De Hero is de enige sectie met een <h1>; alle andere blocks beginnen bij <h2>.
export function Hero({ variant, content, settings }: BlockProps<HeroVariant, HeroContent, HeroSettings>) {
  const { eyebrow, heading, body, buttons, media, accentMedia, stat, highlights, signee } = content;
  // Zodra één item een tekst heeft, wordt de hele lijst als titel + tekst getoond (anders een vinkjeslijst).
  const detailed = highlights?.some((h) => h.description) ?? false;

  return (
    <div className={`blk-hero blk-hero--${variant} blk-hero--h-${settings.height}`}>
      <div className="blk-hero__text">
        {eyebrow && <p className="blk-hero__eyebrow">{eyebrow}</p>}
        <h1 className="blk-hero__heading">{heading}</h1>
        {body && <p className="blk-hero__body">{body}</p>}
        <Buttons buttons={buttons} />

        {highlights && highlights.length > 0 && (
          <ul className={`blk-hero__highlights ${detailed ? "blk-hero__highlights--detailed" : "blk-hero__highlights--check"}`}>
            {highlights.map((h) => (
              <li key={h.label} className="blk-hero__highlight">
                {detailed ? (
                  <>
                    <p className="blk-hero__highlight-label">{h.label}</p>
                    {h.description && <p className="blk-hero__highlight-desc">{h.description}</p>}
                  </>
                ) : (
                  <>
                    <span className="blk-hero__check" aria-hidden="true" />
                    <span>{h.label}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {signee && (
          <div className="blk-hero__signee">
            {signee.avatar && (
              <div className="blk-hero__signee-avatar">
                <Img image={signee.avatar} />
              </div>
            )}
            <div className="blk-hero__signee-info">
              <p className="blk-hero__signee-name">{signee.name}</p>
              {signee.role && <p className="blk-hero__signee-role">{signee.role}</p>}
            </div>
            {signee.signature && (
              <div className="blk-hero__signee-signature">
                <Img image={signee.signature} />
              </div>
            )}
          </div>
        )}
      </div>

      {media && (
        <div className="blk-hero__media-wrap">
          <div className="blk-hero__media">
            <Img image={media} priority />
          </div>
          {accentMedia && (
            <div className="blk-hero__media blk-hero__media--accent">
              <Img image={accentMedia} />
            </div>
          )}
          {stat && (
            <div className="blk-hero__stat">
              <span className="blk-hero__stat-value">{stat.value}</span>
              <span className="blk-hero__stat-label">{stat.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
