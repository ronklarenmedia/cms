import type { BlockProps } from "../contract";
import { Buttons } from "../parts/Buttons";
import type { ContactContent, ContactSettings, ContactVariant } from "./schema";

export function Contact({ variant, content }: BlockProps<ContactVariant, ContactContent, ContactSettings>) {
  const { eyebrow, heading, intro, email, phone, address, hours, buttons } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const hasDetails = Boolean(email || phone || address);

  return (
    <div className={`blk-contact blk-contact--${variant}`}>
      {hasHeader && (
        <header className="blk-contact__header">
          {eyebrow && <p className="blk-contact__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-contact__heading">{heading}</h2>}
          {intro && <p className="blk-contact__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-contact__body">
        {hasDetails && (
          <ul className="blk-contact__details">
            {address && <li className="blk-contact__detail">{address}</li>}
            {phone && (
              <li className="blk-contact__detail">
                <a className="blk-contact__link" href={`tel:${phone.replace(/\s+/g, "")}`}>
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li className="blk-contact__detail">
                <a className="blk-contact__link" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
            )}
          </ul>
        )}

        {hours.length > 0 && (
          <dl className="blk-contact__hours">
            {hours.map((h) => (
              <div key={h.day} className="blk-contact__hours-row">
                <dt className="blk-contact__hours-day">{h.day}</dt>
                <dd className="blk-contact__hours-time">{h.time}</dd>
              </div>
            ))}
          </dl>
        )}

        <Buttons buttons={buttons} />
      </div>
    </div>
  );
}
