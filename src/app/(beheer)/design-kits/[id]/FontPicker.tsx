"use client";

import { CATALOGUE, fontStack, SYSTEM_STACKS, webFontFor, type WebFont } from "@/lib/fonts";

const CATEGORY: Record<WebFont["category"], string> = { sans: "Schreefloos", serif: "Met schreef", mono: "Vaste breedte" };
const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/**
 * Kiest een lettertype uit de zelf gehoste webfonts of de systeemlettertypes; het invoerveld eronder blijft voor een eigen stack.
 * Een webfont wordt op de klantsite meegeleverd (zie src/lib/fonts.ts); een systeemlettertype kost niets.
 */
export function FontPicker({ value, onChange, label }: { value: string; onChange: (stack: string) => void; label: string }) {
  const known = CATALOGUE.find((f) => fontStack(f) === value) ?? null;
  const system = SYSTEM_STACKS.find((s) => s.stack === value) ?? null;
  const web = webFontFor(value);
  const selected = known ? `web:${known.id}` : system ? `sys:${system.stack}` : "eigen";

  return (
    <div className="flex flex-col gap-1">
      <select
        aria-label={`${label}: kies een lettertype`}
        className="input"
        value={selected}
        onChange={(e) => {
          const v = e.target.value;
          if (v.startsWith("web:")) onChange(fontStack(CATALOGUE.find((f) => f.id === v.slice(4))!));
          else if (v.startsWith("sys:")) onChange(v.slice(4));
          // "eigen": de tekst blijft zoals hij is; de gebruiker past hem in het veld eronder aan.
        }}
      >
        {(["sans", "serif", "mono"] as const).map((category) => (
          <optgroup key={category} label={`Webfonts · ${CATEGORY[category]}`}>
            {CATALOGUE.filter((f) => f.category === category).map((f) => (
              <option key={f.id} value={`web:${f.id}`}>
                {f.family} ({kb(f.bytes)})
              </option>
            ))}
          </optgroup>
        ))}
        <optgroup label="Systeemlettertypes (niets te laden)">
          {SYSTEM_STACKS.map((s) => (
            <option key={s.stack} value={`sys:${s.stack}`}>
              {s.label}
            </option>
          ))}
        </optgroup>
        <option value="eigen">Eigen stack…</option>
      </select>
      <span className="text-muted text-[11px]">
        {web
          ? `Webfont, ${kb(web.bytes)}; wordt op de klantsite van het eigen domein geladen.`
          : selected === "eigen"
            ? "Een eigen stack: alleen lettertypes die de bezoeker zelf heeft, werken zeker."
            : "Systeemlettertype: niets te laden."}
      </span>
    </div>
  );
}
