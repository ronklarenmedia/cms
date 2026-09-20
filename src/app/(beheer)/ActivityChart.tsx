import type { Bar } from "@/lib/dashboard";

// Staafjes van het aantal nieuwe versies (publicaties) per uur of dag. Alleen SVG, geen JavaScript in de browser.
// Elk staafje heeft een <title> (tooltip); de grafiek als geheel krijgt een samenvatting voor schermlezers.

const WIDTH = 600;
const HEIGHT = 120;
const BASE = 112;

export function ActivityChart({ bars, summary }: { bars: Bar[]; summary: string }) {
  const max = Math.max(1, ...bars.map((b) => b.count));
  const slot = WIDTH / bars.length;
  const gap = Math.min(4, slot * 0.25);
  const ticks = [0, Math.floor((bars.length - 1) / 2), bars.length - 1];

  return (
    <figure className="m-0 flex flex-col gap-1">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={summary} className="block h-[132px] w-full">
        <line x1="0" x2={WIDTH} y1={BASE} y2={BASE} stroke="var(--color-divider)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {bars.map((b, i) => {
          const h = b.count === 0 ? 0 : Math.max(3, (b.count / max) * (BASE - 8));
          return (
            <g key={i}>
              <title>{`${b.label}: ${b.count} ${b.count === 1 ? "publicatie" : "publicaties"}`}</title>
              <rect x={i * slot + gap / 2} y={BASE - h} width={Math.max(1, slot - gap)} height={h} rx="1.5" fill="var(--color-accent)" />
              {/* Een breed vlak over de hele kolom, zodat ook een leeg staafje een tooltip geeft. */}
              <rect x={i * slot} y="0" width={slot} height={HEIGHT} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <figcaption className="text-muted flex justify-between text-[11px]">
        {ticks.map((i, n) => (
          <span key={n}>{bars[i]?.label}</span>
        ))}
      </figcaption>
    </figure>
  );
}
