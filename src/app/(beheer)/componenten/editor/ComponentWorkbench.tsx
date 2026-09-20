"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import { CATEGORIES, type AnyBlock } from "@/blocks/contract";
import { blocks, getBlock } from "@/blocks/registry";
import { defaultTheme, themes, themeToCssVars, type ThemeId } from "@/blocks/theme";
import { blockJsonSchemas, SchemaFields } from "@/app/(beheer)/websites/SchemaForm";
import { describeIssue, sectionIssues } from "@/app/(beheer)/websites/sections";
import { statusMeta } from "../meta";
import { ScaledFrame } from "../ScaledFrame";

// De breedte waarop het block echt rendert; ScaledFrame schaalt hem naar de kolom.
const devices = [
  { id: "desktop", label: "Desktop", icon: "monitor", width: 1200 },
  { id: "tablet", label: "Tablet", icon: "device-tablet", width: 760 },
  { id: "mobiel", label: "Mobiel", icon: "device-mobile", width: 390 },
] as const;
type DeviceId = (typeof devices)[number]["id"];

type Draft = { variant: string; content: unknown; settings: unknown };

const fromFixture = (block: AnyBlock, index: number): Draft => {
  const f = block.fixtures[index] ?? block.fixtures[0];
  return { variant: f.variant, content: structuredClone(f.content), settings: structuredClone(f.settings ?? {}) };
};

// `--var-font-size-xs` → `fontSizeXs`, om de waarde van een gebruikt token in het gekozen thema op te zoeken.
const tokenByVar = Object.fromEntries(
  Object.keys(defaultTheme).map((k) => ["--var-" + k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), k as keyof typeof defaultTheme]),
);

const on = "bg-accent/16 text-accent-200 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]";
const off = "text-text/75 hover:bg-text/6";
const panel = "flex flex-col gap-3 rounded-md bg-surface p-4 shadow-[var(--shadow-sm)]";
const heading = "!m-0 text-text/75";

export function ComponentWorkbench({
  initialSlug,
  usage,
  tokens,
}: {
  initialSlug: string;
  usage: Record<string, number>;
  tokens: Record<string, string[]>;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const block = getBlock(slug) ?? blocks[0];
  const [fixtureIndex, setFixtureIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => fromFixture(block, 0));
  const [themeId, setThemeId] = useState<ThemeId>("corporate");
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const section = useMemo(
    () => ({ id: "voorbeeld", type: block.slug, variant: draft.variant, content: draft.content, settings: draft.settings }),
    [block.slug, draft],
  );
  const issues = useMemo(() => sectionIssues(section), [section]);
  const errors = Object.fromEntries(issues.map((i) => [i.path, i.message]));
  const schemas = blockJsonSchemas(block);
  const theme = themes[themeId].theme;
  const themeVars = useMemo(() => themeToCssVars(theme), [theme]);
  const merged: Record<string, string | number> = { ...defaultTheme, ...theme };
  const used = tokens[block.slug] ?? [];
  const width = devices.find((d) => d.id === device)!.width;
  const sites = usage[block.slug] ?? 0;

  const selectBlock = (next: string) => {
    const nb = getBlock(next);
    if (!nb) return;
    setSlug(next);
    setFixtureIndex(0);
    setDraft(fromFixture(nb, 0));
    // De URL bijhouden zodat een link naar dit component werkt, zonder een navigatie te starten.
    window.history.replaceState(null, "", `?block=${next}`);
  };
  const selectFixture = (i: number) => {
    setFixtureIndex(i);
    setDraft(fromFixture(block, i));
  };
  const code = JSON.stringify({ id: "sec_01", type: block.slug, variant: draft.variant, content: draft.content, settings: draft.settings }, null, 2);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Klembord kan geweigerd worden; de JSON blijft in beeld om te selecteren.
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="flex flex-wrap items-end gap-[var(--space-6)]">
        <div className="min-w-[240px] flex-1">
          <h2 className="!mb-1">{block.label}</h2>
          <div className="text-muted text-[12.5px]">
            Component · {block.category} · {sites === 0 ? "nog niet gebruikt" : `in ${sites} ${sites === 1 ? "site" : "sites"}`} ·{" "}
            {statusMeta[block.status].label}
          </div>
          <div className="text-muted mt-1 max-w-[640px] text-[12px]">{block.description}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-md bg-surface p-0.5 shadow-[var(--shadow-sm)]">
            {devices.map((d) => (
              <button
                key={d.id}
                type="button"
                title={`${d.label} (${d.width}px)`}
                onClick={() => setDevice(d.id)}
                className={`h-7 w-[30px] rounded-sm text-[15px] ${d.id === device ? on : "text-text/70"}`}
              >
                <i className={`ph ph-${d.icon}`} />
              </button>
            ))}
          </div>
          <button type="button" className={`btn ${showCode ? "btn-primary" : "btn-secondary"}`} onClick={() => setShowCode((v) => !v)}>
            <i className="ph ph-code" />
            Code
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => selectFixture(fixtureIndex)} title="Terug naar het gekozen voorbeeld">
            <i className="ph ph-arrow-counter-clockwise" />
            Herstel
          </button>
          <Link href="/componenten/showcase" className="btn btn-secondary">
            <i className="ph ph-eye" />
            Showcase
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {/* links: component, variant, voorbeelden, thema, tokens */}
        <div className="flex min-w-0 max-w-[260px] flex-[1_1_200px] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h6 className={heading}>Component</h6>
            <select className="input" value={block.slug} onChange={(e) => selectBlock(e.target.value)} aria-label="Component">
              {CATEGORIES.map((c) => {
                const inCategory = blocks.filter((b) => b.category === c);
                return inCategory.length === 0 ? null : (
                  <optgroup key={c} label={c}>
                    {inCategory.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        {b.label}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <h6 className={heading}>Variant</h6>
            {block.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, variant: v.id }))}
                className={`w-full rounded-md px-3 py-2 text-left text-[12.5px] ${v.id === draft.variant ? on : off}`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h6 className={heading}>Voorbeelden</h6>
            <div className="flex flex-col gap-px rounded-md bg-surface p-2 shadow-[var(--shadow-sm)]">
              {block.fixtures.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => selectFixture(i)}
                  className={`flex flex-col rounded-sm px-3 py-1.5 text-left ${i === fixtureIndex ? on : off}`}
                >
                  <span className="text-[12.5px]">{f.name}</span>
                  <span className="text-[10.5px] opacity-60">{block.variants.find((v) => v.id === f.variant)?.label ?? f.variant}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h6 className={heading}>Thema</h6>
            <div className="seg flex text-[12px]">
              {(Object.keys(themes) as ThemeId[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className="seg-opt"
                  aria-pressed={t === themeId}
                  style={{ flex: "1 1 0", minWidth: 0, padding: "5px 2px" }}
                  onClick={() => setThemeId(t)}
                >
                  {themes[t].label}
                </button>
              ))}
            </div>
          </div>

          <details className="flex flex-col gap-2">
            <summary className="cursor-pointer text-[12px] text-text/75">Gebruikte tokens ({used.length})</summary>
            <ul className="mt-2 flex list-none flex-col gap-1 p-0 text-[11px]">
              {used.map((t) => {
                const key = tokenByVar[t];
                const value = key ? String(merged[key]) : "—";
                const isColor = /^#|^rgb|^hsl/.test(value);
                return (
                  <li key={t} className="flex items-center gap-2">
                    {isColor ? <span className="size-3 flex-none rounded-sm shadow-[var(--shadow-sm)]" style={{ background: value }} /> : null}
                    <code className="min-w-0 flex-1 truncate" title={t}>
                      {t.replace("--var-", "")}
                    </code>
                    <span className="text-muted max-w-[90px] truncate" title={value}>
                      {value}
                    </span>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>

        {/* midden: canvas */}
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <h6 className={heading}>Canvas</h6>
            <span className="text-muted text-[11px]">
              {themes[themeId].label} · {width}px
            </span>
          </div>
          <div className="rounded-lg bg-[repeating-conic-gradient(var(--color-neutral-900)_0%_25%,var(--color-surface)_0%_50%)_50%/16px_16px] p-4">
            <div className="overflow-hidden rounded-md bg-white shadow-[var(--shadow-md)]" style={{ width: "100%", maxWidth: width }}>
              <ScaledFrame width={width}>
                <div style={{ ...themeVars, background: "var(--var-color-white)" }}>
                  {issues.length > 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-1 p-4 text-center text-[13px] text-neutral-100">
                      <i className="ph ph-warning text-[20px] text-warning" />
                      {describeIssue(section, issues[0])}
                    </div>
                  ) : (
                    <BlockSection section={section} />
                  )}
                </div>
              </ScaledFrame>
            </div>
          </div>
          <div className="text-muted flex flex-wrap gap-4 text-[11.5px]">
            <span>
              <i className="ph ph-cursor-click mr-1" />
              Wijzigingen zijn alleen een voorbeeld en worden niet opgeslagen
            </span>
            {issues.length > 0 ? (
              <span className="text-danger">
                <i className="ph ph-warning-circle mr-1" />
                {issues.length} {issues.length === 1 ? "veld is" : "velden zijn"} ongeldig
              </span>
            ) : null}
          </div>

          {showCode ? (
            <div className={panel}>
              <div className="flex items-center gap-2">
                <span className="flex-1 text-[12px] text-text/80">Zo staat deze sectie opgeslagen in een pagina</span>
                <button type="button" className="btn btn-secondary" style={{ fontSize: 11.5 }} onClick={() => void copy()}>
                  <i className={`ph ph-${copied ? "check" : "copy"}`} />
                  {copied ? "Gekopieerd" : "Kopieer"}
                </button>
              </div>
              <pre className="m-0 max-h-[320px] overflow-auto rounded-sm bg-neutral-900 p-3 text-[11.5px] leading-[1.5]">{code}</pre>
              <div className="text-muted text-[11.5px]">
                Bestanden: {["schema.ts", "Component.tsx", "fixtures.ts", "styles.css", "index.ts"].map((f) => `src/blocks/${block.slug}/${f}`).join(" · ")}
              </div>
            </div>
          ) : null}
        </div>

        {/* rechts: eigenschappen, gegenereerd uit het schema van het block */}
        <div className="sticky top-0 flex max-h-[calc(100vh-150px)] min-w-0 max-w-[320px] flex-[1_1_260px] flex-col gap-4 overflow-auto">
          <h6 className={heading}>Eigenschappen · {block.label}</h6>
          <div className={panel}>
            <div className="text-[12px] text-text/80">Inhoud</div>
            <SchemaFields
              schema={schemas.content}
              value={draft.content}
              root="content"
              errors={errors}
              onChange={(next) => setDraft((d) => ({ ...d, content: next }))}
            />
          </div>
          <div className={panel}>
            <div className="text-[12px] text-text/80">Sectie</div>
            <SchemaFields
              schema={schemas.settings}
              value={draft.settings}
              root="settings"
              errors={errors}
              onChange={(next) => setDraft((d) => ({ ...d, settings: next }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
