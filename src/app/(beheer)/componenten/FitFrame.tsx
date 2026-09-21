"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Toont een block op een vaste breedte (bijv. 1200px voor "desktop", zodat container queries op de echte breedte reageren) en schaalt hem
 * met behoud van de verhouding zo ver mogelijk in de beschikbare ruimte, gecentreerd. Een laag block wordt dus breed en plat getoond, een
 * hoog block smal en lang: de miniatuur heeft de echte vorm van het block, en de ouder bepaalt de cel waarin hij netjes wordt uitgelijnd.
 * Niet groter dan 100%: een klein block wordt nooit opgeblazen. Vult zijn ouder (`h-full w-full`); de ouder geeft de afmetingen.
 */
export function FitFrame({ width, children }: { width: number; children: ReactNode }) {
  const cell = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const c = cell.current;
    const i = content.current;
    if (!c || !i) return;
    const update = () => {
      const natural = i.offsetHeight;
      if (natural === 0 || c.clientWidth === 0 || c.clientHeight === 0) return;
      setFit({ scale: Math.min(1, c.clientWidth / width, c.clientHeight / natural), height: natural });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(c);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width]);

  const scale = fit?.scale ?? 1;
  return (
    <div ref={cell} className="flex h-full w-full items-center justify-center overflow-hidden">
      {/* De zichtbare afmetingen na het schalen; de inhoud zelf houdt zijn echte breedte en wordt met transform verkleind. */}
      <div
        className="flex-none overflow-hidden rounded-[3px] bg-white shadow-[var(--shadow-sm)]"
        style={{ width: width * scale, height: fit ? fit.height * scale : undefined, visibility: fit ? "visible" : "hidden" }}
      >
        <div ref={content} style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
