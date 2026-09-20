"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Rendert de inhoud op een vaste breedte (bijv. 1200px voor "desktop") en schaalt hem visueel naar de
 * beschikbare ruimte. Zo reageren blocks (container queries) op de echte breedte, ook in een smalle kolom.
 * Met `clip` bepaalt de ouder de hoogte (miniaturen); anders volgt de hoogte de geschaalde inhoud.
 */
export function ScaledFrame({ width, clip = false, children }: { width: number; clip?: boolean; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      const scale = Math.min(1, o.clientWidth / width);
      setM({ scale, height: i.offsetHeight * scale });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={outer}
      style={{ position: "relative", overflow: "hidden", height: clip ? "100%" : (m?.height ?? undefined) }}
    >
      <div
        ref={inner}
        style={{
          width,
          transform: `scale(${m?.scale ?? 1})`,
          transformOrigin: "top left",
          // Pas tonen na de eerste meting, anders flitst de ongeschaalde versie even door.
          visibility: m ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
