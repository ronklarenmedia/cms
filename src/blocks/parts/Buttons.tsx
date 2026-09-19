import type { Button } from "../contract";

/** Knoppenrij; toont niets als er geen knoppen zijn. Stijl staat in blocks.css (.blk-btn). */
export function Buttons({ buttons }: { buttons: Button[] }) {
  if (buttons.length === 0) return null;
  return (
    <div className="blk-btns">
      {buttons.map((b) => (
        <a key={`${b.label}-${b.href}`} className={`blk-btn blk-btn--${b.style}`} href={b.href}>
          {b.label}
        </a>
      ))}
    </div>
  );
}
