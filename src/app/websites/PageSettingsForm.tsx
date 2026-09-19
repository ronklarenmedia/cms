"use client";

import { useState } from "react";
import { updatePageSettings, type PageDTO, type PageSettings } from "./actions";
import { documentTitle, SEO_DESCRIPTION_MAX, SEO_TITLE_MAX } from "./seo";

type Draft = { title: string; slug: string; seoTitle: string; seoDescription: string; ogImage: string; noindex: boolean };

const toDraft = (p: PageSettings): Draft => ({
  title: p.title,
  slug: p.slug,
  seoTitle: p.seoTitle ?? "",
  seoDescription: p.seoDescription ?? "",
  ogImage: p.ogImage ?? "",
  noindex: p.noindex,
});

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function Counter({ length, max }: { length: number; max: number }) {
  return (
    <span className={`text-[10px] ${length > max ? "text-danger" : "text-text/55"}`}>
      {length}/{max}
    </span>
  );
}

/** Titel, URL en SEO-velden van één pagina, met een voorbeeld van hoe de pagina in zoekresultaten kan verschijnen. */
export function PageSettingsForm({
  page,
  siteName,
  onSaved,
}: {
  page: PageDTO;
  siteName: string;
  onSaved: (settings: PageSettings) => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(page));
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });
  const isHome = page.slug === "";
  const changed = JSON.stringify(draft) !== JSON.stringify(toDraft(page));
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setState({ kind: "idle" });
  };

  const title = documentTitle(siteName, { slug: draft.slug, title: draft.title, seoTitle: draft.seoTitle });
  const description = draft.seoDescription.trim();

  async function save() {
    setState({ kind: "saving" });
    try {
      const res = await updatePageSettings(page.id, {
        title: draft.title,
        slug: draft.slug,
        seoTitle: draft.seoTitle.trim() || null,
        seoDescription: draft.seoDescription.trim() || null,
        ogImage: draft.ogImage.trim() || null,
        noindex: draft.noindex,
      });
      if (!res.ok) return setState({ kind: "error", message: res.error });
      setDraft(toDraft(res.settings));
      onSaved(res.settings);
      setState({ kind: "saved" });
    } catch {
      setState({ kind: "error", message: "Opslaan mislukt: geen verbinding met de server." });
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <label className="field" style={{ gap: 4 }}>
        <span className="text-[11px]">Titel van de pagina</span>
        <input className="input" style={{ fontSize: 11.5, padding: "6px 8px" }} value={draft.title} onChange={(e) => set("title", e.target.value)} required />
      </label>

      <label className="field" style={{ gap: 4 }}>
        <span className="text-[11px]">URL</span>
        <input
          className="input"
          style={{ fontSize: 11.5, padding: "6px 8px" }}
          value={isHome ? "" : draft.slug}
          placeholder={isHome ? "/ (homepagina)" : "over-ons"}
          disabled={isHome}
          onChange={(e) => set("slug", e.target.value)}
        />
        <span className="text-[10.5px] text-text/55">
          {isHome ? "De URL van de homepagina staat vast." : "Alleen kleine letters, cijfers en streepjes. Menulinks naar de oude URL moet je zelf aanpassen."}
        </span>
      </label>

      <div className="flex flex-col gap-1.5 border-t border-divider pt-3">
        <span className="font-heading text-[10.5px] uppercase tracking-[0.08em] text-text/60">Zoekmachines</span>

        {/* Zo kan de pagina in Google verschijnen; alleen een indicatie. */}
        <div className="flex flex-col gap-0.5 rounded-md border border-divider bg-surface p-3" aria-label="Voorbeeld van een zoekresultaat">
          <span className="truncate text-[10.5px] text-text/55">
            {siteName} › {draft.slug || "home"}
          </span>
          <span className="text-[14px] leading-snug text-accent-300">{clip(title, SEO_TITLE_MAX)}</span>
          <span className="text-[11.5px] leading-snug text-text/70">
            {description ? clip(description, SEO_DESCRIPTION_MAX) : "Zonder omschrijving kiest de zoekmachine zelf een stukje tekst van de pagina."}
          </span>
        </div>
      </div>

      <label className="field" style={{ gap: 4 }}>
        <span className="flex items-baseline justify-between text-[11px]">
          SEO-titel <Counter length={draft.seoTitle.length} max={SEO_TITLE_MAX} />
        </span>
        <input
          className="input"
          style={{ fontSize: 11.5, padding: "6px 8px" }}
          value={draft.seoTitle}
          placeholder={documentTitle(siteName, { slug: draft.slug, title: draft.title, seoTitle: null })}
          onChange={(e) => set("seoTitle", e.target.value)}
        />
      </label>

      <label className="field" style={{ gap: 4 }}>
        <span className="flex items-baseline justify-between text-[11px]">
          Omschrijving <Counter length={draft.seoDescription.length} max={SEO_DESCRIPTION_MAX} />
        </span>
        <textarea
          className="input"
          rows={3}
          style={{ fontSize: 11.5, padding: "6px 8px", resize: "vertical" }}
          value={draft.seoDescription}
          onChange={(e) => set("seoDescription", e.target.value)}
        />
      </label>

      <label className="field" style={{ gap: 4 }}>
        <span className="text-[11px]">Afbeelding bij delen</span>
        <input
          className="input"
          style={{ fontSize: 11.5, padding: "6px 8px" }}
          value={draft.ogImage}
          placeholder="https://… of /pad/naar/afbeelding.jpg"
          onChange={(e) => set("ogImage", e.target.value)}
        />
      </label>

      <label className="radio" style={{ fontSize: 11, gap: 6 }}>
        <input type="checkbox" checked={draft.noindex} onChange={(e) => set("noindex", e.target.checked)} />
        <span className="dot" />
        <span>Niet laten indexeren door zoekmachines</span>
      </label>

      <div className="flex items-center gap-2">
        <button type="submit" className="btn btn-primary" style={{ fontSize: 11.5 }} disabled={!changed || state.kind === "saving"}>
          {state.kind === "saving" ? "Opslaan…" : "Opslaan"}
        </button>
        <span
          className={`min-w-0 flex-1 text-[11px] ${state.kind === "error" ? "text-danger" : "text-text/60"}`}
          role={state.kind === "error" ? "alert" : "status"}
        >
          {state.kind === "saved" ? "Opgeslagen" : state.kind === "error" ? state.message : changed ? "Niet-opgeslagen wijzigingen" : ""}
        </span>
      </div>
    </form>
  );
}
