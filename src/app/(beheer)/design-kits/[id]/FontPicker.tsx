"use client";

import { useState } from "react";
import type { HostedFont } from "@/db/schema";
import { FONT_WEIGHT_LABEL, FONT_WEIGHTS } from "@/lib/custom-fonts-index";
import { CATALOGUE, familyStack, fontStack, SYSTEM_STACKS, webFontFor, type WebFont } from "@/lib/fonts";
import { googleFontsIndex } from "@/lib/google-fonts-index";
import { uploadCustomFont } from "../custom-fonts-actions";
import { fetchGoogleFont } from "../google-fonts-actions";

const CATEGORY: Record<WebFont["category"], string> = { sans: "Schreefloos", serif: "Met schreef", mono: "Vaste breedte", display: "Uitgesproken", handwriting: "Handschrift" };
const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
const MAX_RESULTS = 8;

/**
 * Kiest een lettertype uit de zelf gehoste webfonts, de systeemlettertypes, of zoekt in de volledige Google Fonts-
 * bibliotheek (on-demand: de eerste keer dat iemand een familie kiest, haalt de server hem op en host hem zelf
 * voortaan, zie src/lib/google-fonts.ts). Het invoerveld eronder blijft voor een eigen stack.
 */
export function FontPicker({
  value,
  onChange,
  label,
  hosted,
  onHosted,
}: {
  value: string;
  onChange: (stack: string) => void;
  label: string;
  /** Al on-demand gehoste Google Fonts, voor een directe toepassing zonder opnieuw op te halen. */
  hosted: HostedFont[];
  /** Aangeroepen zodra een nieuwe familie is opgehaald, zodat de rest van de editor hem meteen kent. */
  onHosted: (font: HostedFont) => void;
}) {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadProblem, setUploadProblem] = useState<string | null>(null);

  const known = CATALOGUE.find((f) => fontStack(f) === value) ?? null;
  const system = SYSTEM_STACKS.find((s) => s.stack === value) ?? null;
  const web = webFontFor(value);
  const selected = known ? `web:${known.id}` : system ? `sys:${system.stack}` : "eigen";

  const needle = query.trim().toLowerCase();
  const results = needle.length < 2 ? [] : googleFontsIndex().filter((f) => f.family.toLowerCase().includes(needle)).slice(0, MAX_RESULTS);

  async function pick(family: string) {
    setProblem(null);
    const already = hosted.find((f) => f.family.toLowerCase() === family.toLowerCase());
    if (already) {
      onChange(familyStack(already.family, already.category));
      setQuery("");
      return;
    }
    setBusy(family);
    try {
      const res = await fetchGoogleFont(family);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      onHosted(res.font);
      onChange(familyStack(res.font.family, res.font.category));
      setQuery("");
    } catch {
      setProblem("Ophalen is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBusy(null);
    }
  }

  async function upload(form: HTMLFormElement) {
    setUploadProblem(null);
    setUploadBusy(true);
    try {
      const res = await uploadCustomFont(new FormData(form));
      if (!res.ok) {
        setUploadProblem(res.error);
        return;
      }
      onHosted(res.font);
      onChange(familyStack(res.font.family, res.font.category));
      form.reset();
    } catch {
      setUploadProblem("Uploaden is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setUploadBusy(false);
    }
  }

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

      <div className="relative">
        <input
          type="search"
          className="input"
          placeholder="Zoek in alle Google Fonts…"
          aria-label={`${label}: zoek een Google Font`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setProblem(null);
          }}
        />
        {results.length > 0 ? (
          <ul className="absolute top-full right-0 left-0 z-10 mt-1 max-h-52 overflow-auto rounded-md bg-surface py-1 shadow-[var(--shadow-md)]">
            {results.map((f) => {
              const already = hosted.some((h) => h.family.toLowerCase() === f.family.toLowerCase());
              return (
                <li key={f.family}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] hover:bg-text/6 disabled:opacity-60"
                    disabled={busy !== null}
                    onClick={() => void pick(f.family)}
                  >
                    <span style={{ fontFamily: familyStack(f.family, f.category) }}>{f.family}</span>
                    <span className="text-muted ml-auto text-[10.5px]">{busy === f.family ? "Ophalen…" : already ? "al gehost" : CATEGORY[f.category]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {problem ? (
        <span role="alert" className="text-danger text-[11px]">
          {problem}
        </span>
      ) : null}

      <button type="button" className="self-start text-[11px] text-accent underline" onClick={() => setShowUpload((v) => !v)}>
        {showUpload ? "Eigen lettertype uploaden verbergen" : "Eigen lettertype uploaden…"}
      </button>
      {showUpload ? (
        <form
          className="flex flex-col gap-1.5 rounded-md border border-divider p-2"
          onSubmit={(e) => {
            e.preventDefault();
            void upload(e.currentTarget);
          }}
        >
          <input type="text" name="family" required maxLength={80} placeholder="Naam (bijv. Huisstijl Sans)" aria-label="Naam van het eigen lettertype" className="input" />
          <div className="flex gap-1.5">
            <select name="weight" defaultValue="400" aria-label="Gewicht" className="input">
              {FONT_WEIGHTS.map((w) => (
                <option key={w} value={w}>
                  {FONT_WEIGHT_LABEL[w]}
                </option>
              ))}
            </select>
            <select name="category" defaultValue="sans" aria-label="Categorie" className="input">
              {Object.entries(CATEGORY).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <input type="file" name="file" accept=".woff2" required aria-label="Lettertypebestand (.woff2)" className="input" />
          <button type="submit" className="btn btn-secondary self-start" disabled={uploadBusy}>
            {uploadBusy ? "Uploaden…" : "Toevoegen"}
          </button>
          <span className="text-muted text-[10.5px]">
            Alleen .woff2, maximaal 2 MB. Een tweede gewicht voor dezelfde naam wordt aan die familie toegevoegd.
          </span>
          {uploadProblem ? (
            <span role="alert" className="text-danger text-[11px]">
              {uploadProblem}
            </span>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
