import type { ReactNode } from "react";
import type { SectionSettings } from "./contract";

/**
 * Wrapper om elk block: achtergrond, verticale ruimte, breedte, uitlijning en zichtbaarheid.
 * Blocks renderen alleen hun eigen inhoud; alles hieronder komt uit `settings`.
 * De buitenste <section> is de query-container (zie blocks.css), de binnenste div het visuele vlak.
 */
export function Section({
  block,
  variant,
  settings,
  children,
}: {
  block: string;
  variant: string;
  settings: SectionSettings;
  children: ReactNode;
}) {
  const classes = [
    "blk",
    `blk--bg-${settings.background}`,
    `blk--py-${settings.paddingY}`,
    `blk--align-${settings.align}`,
    !settings.visibility.desktop && "blk--hide-desktop",
    !settings.visibility.tablet && "blk--hide-tablet",
    !settings.visibility.mobile && "blk--hide-mobile",
  ].filter(Boolean);

  return (
    <section id={settings.anchor} className="blk-root" data-block={block} data-variant={variant}>
      <div className={classes.join(" ")}>
        <div className={`blk__inner blk__inner--${settings.maxWidth}`}>{children}</div>
      </div>
    </section>
  );
}
