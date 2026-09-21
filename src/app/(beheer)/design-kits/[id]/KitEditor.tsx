"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import type { SectionData } from "@/blocks/contract";
import { getBlock } from "@/blocks/registry";
import { defaultTheme, themeToCssVars, type SiteTheme, type ThemeToken } from "@/blocks/theme";
import { ThemeFonts } from "@/lib/theme-fonts";
import { parseTokenValue, TOKEN_GROUPS, TOKENS, tokenKind, tokenLabel } from "@/lib/theme-tokens";
import { FontPicker } from "./FontPicker";
import { ScaledFrame } from "../../componenten/ScaledFrame";
import { useConfirm } from "../../ConfirmDialog";
import { deleteKit, saveKit } from "../actions";

// De kit-editor: alle tokens, gegroepeerd, met een live voorbeeld van echte blocks. Alleen wat afwijkt van de standaard wordt bewaard.

const devices = [
  { id: "desktop", label: "Desktop", icon: "monitor", width: 1200 },
  { id: "tablet", label: "Tablet", icon: "device-tablet", width: 760 },
  { id: "mobiel", label: "Mobiel", icon: "device-mobile", width: 390 },
] as const;

// Een dwarsdoorsnede van wat een site bevat: kop, tekst, kaarten, cijfers, prijzen en voet.
const SAMPLE = ["site-header", "hero", "usp-grid", "text-image", "stats", "testimonials", "pricing", "faq", "cta-banner", "site-footer"];
const sampleSections: SectionData[] = SAMPLE.flatMap((slug) => {
  const block = getBlock(slug);
  const fixture = block?.fixtures[0];
  return block && fixture ? [{ id: `kit-${slug}`, type: slug, variant: fixture.variant, content: fixture.content, settings: fixture.settings ?? {} }] : [];
});

const hex6 = (v: string) => {
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  const short = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  return short ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}` : "#000000";
};

type Values = Record<ThemeToken, string>;
const initialValues = (theme: SiteTheme): Values => Object.fromEntries(TOKENS.map((t) => [t, String(theme[t] ?? defaultTheme[t])])) as Values;

export function KitEditor({
  kit,
  sites,
  canDelete,
}: {
  kit: { id: string; name: string; theme: SiteTheme; customerName: string | null };
  sites: { id: string; name: string }[];
  canDelete: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(kit.name);
  const [values, setValues] = useState<Values>(() => initialValues(kit.theme));
  const [saved, setSaved] = useState(() => JSON.stringify({ name: kit.name, theme: kit.theme }));
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const [message, setMessage] = useState<{ tone: "ok" | "fout"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirm, confirmDialog] = useConfirm();

  // Per token de gecontroleerde waarde of een foutmelding; alleen geldige waarden komen in het voorbeeld en in de opslag.
  const parsed = useMemo(() => TOKENS.map((t) => [t, parseTokenValue(t, values[t])] as const), [values]);
  const errors = useMemo(() => Object.fromEntries(parsed.flatMap(([t, r]) => (r.ok ? [] : [[t, r.error]]))) as Partial<Record<ThemeToken, string>>, [parsed]);
  const theme = useMemo(() => {
    const out: Record<string, string | number> = {};
    for (const [t, r] of parsed) if (r.ok && String(r.value) !== String(defaultTheme[t])) out[t] = r.value;
    return out as SiteTheme;
  }, [parsed]);
  const previewVars = useMemo(() => themeToCssVars(theme), [theme]);
  const isChanged = (t: ThemeToken) => t in theme;
  const errorCount = Object.keys(errors).length;
  const dirty = JSON.stringify({ name, theme }) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (t: ThemeToken, v: string) => {
    setValues((prev) => ({ ...prev, [t]: v }));
    setMessage(null);
  };
  const reset = (tokens: readonly ThemeToken[]) => {
    setValues((prev) => ({ ...prev, ...Object.fromEntries(tokens.map((t) => [t, String(defaultTheme[t])])) }));
    setMessage(null);
  };

  const save = () =>
    startTransition(async () => {
      const res = await saveKit(kit.id, { name, theme });
      if (res.ok) {
        setSaved(JSON.stringify({ name: name.trim(), theme }));
        setName((n) => n.trim());
        setMessage({ tone: "ok", text: `Opgeslagen · ${res.tokens} ${res.tokens === 1 ? "token wijkt" : "tokens wijken"} af van de standaard.` });
        router.refresh();
      } else setMessage({ tone: "fout", text: res.error });
    });

  const remove = async () => {
    if (!(await confirm(`De kit "${kit.name}" verwijderen? Dit kan niet ongedaan worden gemaakt.`, { title: "Kit verwijderen", confirmLabel: "Verwijderen", danger: true }))) return;
    startTransition(async () => {
      const res = await deleteKit(kit.id);
      if (res.ok) router.push("/design-kits");
      else setMessage({ tone: "fout", text: res.error });
    });
  };

  const needle = query.trim().toLowerCase();
  const filtering = needle !== "" || onlyChanged;
  const visible = (t: ThemeToken) => (!needle || tokenLabel(t).toLowerCase().includes(needle) || t.toLowerCase().includes(needle)) && (!onlyChanged || isChanged(t));
  const width = devices.find((d) => d.id === device)!.width;
  const usedBy = sites.length;

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="flex flex-wrap items-end gap-[var(--space-4)]">
        <div className="min-w-[260px] flex-1">
          <Link href="/design-kits" className="text-muted text-[12px] hover:underline">
            ← Design kits
          </Link>
          <input
            aria-label="Naam van de kit"
            value={name}
            maxLength={255}
            onChange={(e) => {
              setName(e.target.value);
              setMessage(null);
            }}
            className="font-heading mt-1 block w-full border-0 border-b border-transparent bg-transparent p-0 text-[26px] font-medium outline-none hover:border-divider focus:border-accent"
          />
          <div className="text-muted mt-1 text-[12.5px]">
            {kit.customerName ?? "Platformkit"} ·{" "}
            {usedBy === 0 ? (
              "nog niet gebruikt"
            ) : (
              <>
                gebruikt door{" "}
                {sites.slice(0, 4).map((s, i) => (
                  <span key={s.id}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/websites/${s.id}`} className="text-text hover:underline">
                      {s.name}
                    </Link>
                  </span>
                ))}
                {usedBy > 4 ? ` en ${usedBy - 4} andere` : ""}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/design-kits/nieuw?kopie=${kit.id}`} className="btn btn-secondary" style={{ fontSize: 12 }}>
            <i className="ph ph-copy" /> Dupliceren
          </Link>
          {canDelete ? (
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={remove} disabled={pending || usedBy > 0} title={usedBy > 0 ? "Deze kit is in gebruik" : "Kit verwijderen"}>
              <i className="ph ph-trash" /> Verwijderen
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={save} disabled={pending || !dirty || errorCount > 0 || name.trim() === ""}>
            {pending ? "Opslaan…" : "Opslaan"}
          </button>
        </div>
      </div>

      {message ? (
        <div role={message.tone === "fout" ? "alert" : "status"} className={`rounded-md border px-3 py-2 text-[13px] ${message.tone === "ok" ? "border-success/40 bg-success/8 text-success" : "border-danger/40 bg-danger/8 text-danger"}`}>
          {message.text}
        </div>
      ) : usedBy > 0 ? (
        <div className="rounded-md border border-divider bg-text/4 px-3 py-2 text-[12.5px] text-text/80">
          Wijzigingen zijn direct te zien in de builder van deze websites. Een site die al live staat, krijgt de nieuwe stijl bij zijn volgende publicatie.
        </div>
      ) : null}

      <div className="flex flex-wrap items-start gap-[var(--space-6)]">
        {/* links: de tokens */}
        <div className="flex min-w-[300px] flex-[0_1_400px] flex-col gap-3">
          <div className="flex items-center gap-2">
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek een token" aria-label="Zoek een token" className="input min-w-0 flex-1" />
            <label className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
              <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} /> Alleen gewijzigd
            </label>
          </div>
          <div className="text-muted text-[11.5px]">
            {Object.keys(theme).length} van {TOKENS.length} tokens wijken af van de standaard
            {errorCount > 0 ? <span className="text-danger"> · {errorCount} ongeldig</span> : null}
          </div>

          {TOKEN_GROUPS.map((group, gi) => {
            const shown = group.tokens.filter(visible);
            if (shown.length === 0) return null;
            const changed = group.tokens.filter(isChanged);
            return (
              <details key={group.id + (filtering ? "-f" : "")} open={filtering || gi < 2} className="rounded-md bg-surface shadow-[var(--shadow-sm)]">
                <summary className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-[13px] font-medium select-none">
                  {group.label}
                  <span className="text-muted text-[11px] font-normal">
                    {group.tokens.length}
                    {changed.length > 0 ? ` · ${changed.length} gewijzigd` : ""}
                  </span>
                  {changed.length > 0 ? (
                    <button
                      type="button"
                      className="text-muted ml-auto text-[11px] font-normal underline-offset-2 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        reset(group.tokens);
                      }}
                    >
                      Herstel groep
                    </button>
                  ) : null}
                </summary>
                {group.description ? <p className="text-muted !mb-0 px-3 pb-2 text-[11.5px]">{group.description}</p> : null}
                <ul className="m-0 flex list-none flex-col gap-2.5 px-3 pt-1 pb-3">
                  {shown.map((t) => {
                    const kind = tokenKind(t);
                    const error = errors[t];
                    return (
                      <li key={t} className="flex flex-col gap-1">
                        <label htmlFor={`tok-${t}`} className="flex items-baseline gap-2 text-[12px]">
                          <span className={isChanged(t) ? "font-medium" : ""}>{tokenLabel(t)}</span>
                          <code className="text-muted text-[10.5px]">{t}</code>
                          {isChanged(t) ? (
                            <button type="button" className="text-muted ml-auto text-[11px] underline-offset-2 hover:underline" onClick={() => reset([t])} title={`Standaard: ${defaultTheme[t]}`}>
                              Herstel
                            </button>
                          ) : null}
                        </label>
                        {t.startsWith("fontFamily") ? <FontPicker value={values[t]} onChange={(v) => set(t, v)} label={tokenLabel(t)} /> : null}
                        <div className="flex items-center gap-2">
                          {kind === "color" ? (
                            <input type="color" aria-label={`${tokenLabel(t)} kiezen`} value={hex6(values[t])} onChange={(e) => set(t, e.target.value)} className="size-8 flex-none cursor-pointer rounded-sm border border-divider bg-transparent p-0.5" />
                          ) : null}
                          <input
                            id={`tok-${t}`}
                            className="input min-w-0 flex-1"
                            value={values[t]}
                            onChange={(e) => set(t, e.target.value)}
                            inputMode={kind === "number" ? "decimal" : undefined}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `err-${t}` : undefined}
                            spellCheck={false}
                          />
                        </div>
                        {error ? (
                          <span id={`err-${t}`} className="text-danger text-[11.5px]">
                            {error}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
          {filtering && TOKEN_GROUPS.every((g) => g.tokens.filter(visible).length === 0) ? <p className="text-muted !mb-0 text-[13px]">Geen tokens gevonden.</p> : null}
        </div>

        {/* rechts: live voorbeeld */}
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
          <div className="flex items-center gap-3">
            <h6 className="!m-0 text-text/75">Voorbeeld</h6>
            <span className="text-muted text-[11px]">{width}px · echte blocks met dit thema</span>
            <div className="ml-auto flex gap-0.5 rounded-md bg-surface p-0.5 shadow-[var(--shadow-sm)]">
              {devices.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  title={`${d.label} (${d.width}px)`}
                  aria-pressed={d.id === device}
                  onClick={() => setDevice(d.id)}
                  className={`h-7 w-[30px] rounded-sm text-[15px] ${d.id === device ? "bg-accent/16 text-accent-200" : "text-text/70"}`}
                >
                  <i className={`ph ph-${d.icon}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-[repeating-conic-gradient(var(--color-neutral-900)_0%_25%,var(--color-surface)_0%_50%)_50%/16px_16px] p-4">
            <div className="overflow-hidden rounded-md bg-white shadow-[var(--shadow-md)]" style={{ width: "100%", maxWidth: width }}>
              <ScaledFrame width={width}>
                <div style={{ ...previewVars, background: "var(--var-color-white)" }}>
                  <ThemeFonts theme={theme} />
                  {sampleSections.map((s) => (
                    <BlockSection key={s.id} section={s} />
                  ))}
                </div>
              </ScaledFrame>
            </div>
          </div>
        </div>
      </div>
      {confirmDialog}
    </div>
  );
}
