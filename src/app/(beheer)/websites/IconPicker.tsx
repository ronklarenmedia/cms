"use client";

import { useState } from "react";
import { materialIconNames } from "@/lib/material-icons-index";
import { fetchMaterialIcon } from "./icons-actions";

const MAX_RESULTS = 8;
const label = (name: string) => name.replace(/_/g, " ");

/**
 * Icoonveld voor usp-grid (src/app/(beheer)/websites/SchemaForm.tsx, `FIELD_OVERRIDES`): een vrij tekstveld voor een
 * emoji (huidige gedrag, blijft gewoon werken) plus een zoekveld over de volledige Material Symbols-bibliotheek.
 * Kiezen van een nog niet gehost icoon haalt het op (server-actie, on-demand — zie src/lib/material-icons.ts) en
 * onthoudt het voor de rest van deze bouwersessie via `hosted`/`onHosted`.
 */
export function IconPicker({
  value,
  onChange,
  hosted,
  onHosted,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Iconnaam → gesaneerde SVG, van iconen die deze sessie al gehost zijn (of al waren). */
  hosted: Record<string, string>;
  onHosted: (name: string, svg: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const needle = query.trim().toLowerCase().replace(/\s+/g, "_");
  const results = needle.length < 2 ? [] : materialIconNames().filter((n) => n.includes(needle)).slice(0, MAX_RESULTS);
  const currentSvg = hosted[value];

  async function pick(name: string) {
    setProblem(null);
    if (hosted[name]) {
      onChange(name);
      setQuery("");
      return;
    }
    setBusy(name);
    try {
      const res = await fetchMaterialIcon(name);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      onHosted(res.icon.name, res.icon.svg);
      onChange(res.icon.name);
      setQuery("");
    } catch {
      setProblem("Ophalen is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {currentSvg ? <span className="size-5 flex-none text-text/80" aria-hidden="true" dangerouslySetInnerHTML={{ __html: currentSvg }} /> : null}
        <input
          className="input min-w-0 flex-1"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Emoji, of zoek hieronder een Material Symbol"
        />
      </div>
      <div className="relative">
        <input
          type="search"
          className="input"
          placeholder="Zoek een icoon…"
          aria-label="Zoek een Material Symbol"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setProblem(null);
          }}
        />
        {results.length > 0 ? (
          <ul className="absolute top-full right-0 left-0 z-10 mt-1 max-h-52 overflow-auto rounded-md bg-surface py-1 shadow-[var(--shadow-md)]">
            {results.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] hover:bg-text/6 disabled:opacity-60"
                  disabled={busy !== null}
                  onClick={() => void pick(name)}
                >
                  {hosted[name] ? (
                    <span className="size-4 flex-none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: hosted[name] }} />
                  ) : (
                    <i className="ph ph-shapes size-4 flex-none text-text/50" aria-hidden="true" />
                  )}
                  <span>{label(name)}</span>
                  <span className="text-muted ml-auto text-[10.5px]">{busy === name ? "Ophalen…" : hosted[name] ? "al gehost" : ""}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {problem ? (
        <span role="alert" className="text-danger text-[11px]">
          {problem}
        </span>
      ) : null}
    </div>
  );
}
