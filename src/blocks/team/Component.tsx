import type { BlockProps } from "../contract";
import { Img } from "../parts/Img";
import { JsonLd } from "../parts/JsonLd";
import type { TeamContent, TeamSettings, TeamVariant } from "./schema";

export function Team({
  variant,
  content,
  settings,
}: BlockProps<TeamVariant, TeamContent, TeamSettings>) {
  const { eyebrow, heading, intro, members } = content;
  const hasHeader = Boolean(eyebrow || heading || intro);
  const MemberHeading = heading ? "h3" : "h2";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: members.map((member, idx) => ({
      "@type": "Person",
      position: idx + 1,
      name: member.name,
      jobTitle: member.role,
      image: member.image.url,
      description: member.bio,
    })),
  };

  return (
    <div className={`blk-team blk-team--${variant} blk-team--cols-${settings.columns}`}>
      <JsonLd data={jsonLdData} />
      {hasHeader && (
        <header className="blk-team__header">
          {eyebrow && <p className="blk-team__eyebrow">{eyebrow}</p>}
          {heading && <h2 className="blk-team__heading">{heading}</h2>}
          {intro && <p className="blk-team__intro">{intro}</p>}
        </header>
      )}

      <div className="blk-team__grid">
        {members.map((member, idx) => (
          <article key={`${member.name}-${idx}`} className="blk-team__member">
            <div className="blk-team__media">
              <Img image={member.image} />
            </div>
            <div className="blk-team__info">
              <MemberHeading className="blk-team__name">{member.name}</MemberHeading>
              <p className="blk-team__role">{member.role}</p>
              {member.bio && <p className="blk-team__bio">{member.bio}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
