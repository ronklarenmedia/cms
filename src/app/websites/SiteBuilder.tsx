"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import { CATEGORIES, type AnyBlock, type SectionData } from "@/blocks/contract";
import { blocks, getBlock } from "@/blocks/registry";
import { themeToCssVars, type SiteTheme } from "@/blocks/theme";
import { addPage, deletePage, deleteSite, renamePage, savePage, setSiteStatus, type PageDTO } from "./actions";
import { blockJsonSchemas, SchemaFields } from "./SchemaForm";
import { describeIssue, newSection, sectionIssues, sectionsProblems } from "./sections";

export type BuilderSite = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "live";
  theme: SiteTheme;
  customerName: string;
};

type Device = "desktop" | "tablet" | "mobiel";
const devices: { id: Device; icon: string; width: string; label: string }[] = [
  { id: "desktop", icon: "monitor", width: "100%", label: "Desktop" },
  { id: "tablet", icon: "device-tablet", width: "760px", label: "Tablet" },
  { id: "mobiel", icon: "device-mobile", width: "390px", label: "Mobiel" },
];

type History = { past: SectionData[][]; future: SectionData[][] };
type SaveStatus = { kind: "saved" | "dirty" | "saving" | "error"; message?: string };

const on = "bg-accent/16 text-accent-200 ring-1 ring-inset ring-accent/40";
const off = "text-text/70 hover:bg-text/7";
const FLUSH_DELAY = 1200;
const nowMs = () => Date.now();
const iconBtn = "btn btn-ghost size-5 flex-none !p-0 !text-[12px]";

const pageIcon = (slug: string) => (slug === "" ? "house" : "file-text");
const headingOf = (s: SectionData) => {
  const h = (s.content as { heading?: unknown } | null)?.heading;
  return typeof h === "string" ? h : "";
};

/** Eén sectie in het canvas; ongeldige inhoud toont een placeholder zodat de rest van de pagina blijft staan. */
const CanvasSection = memo(function CanvasSection({ section }: { section: SectionData }) {
  const issues = sectionIssues(section);
  if (issues.length > 0) {
    return (
      <div className="flex min-h-[90px] flex-col items-center justify-center gap-1 bg-neutral-900 p-4 text-center text-[12px] text-text/70">
        <i className="ph ph-warning text-[18px] text-warning" />
        <span>{describeIssue(section, issues[0])}</span>
      </div>
    );
  }
  return <BlockSection section={section} />;
});

function Library({ onPick, onClose }: { onPick: (block: AnyBlock) => void; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6"
      onClick={onClose}
      role="dialog"
      aria-label="Sectie toevoegen"
    >
      <div
        className="flex max-h-[80vh] w-full max-w-[720px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <h4 className="!mb-0 flex-1">Sectie toevoegen</h4>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten">
            <i className="ph ph-x" />
          </button>
        </div>
        {CATEGORIES.map((category) => {
          const inCategory = blocks.filter((b) => b.category === category && b.status !== "verouderd");
          if (inCategory.length === 0) return null;
          return (
            <div key={category} className="flex flex-col gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.08em] text-text/60">{category}</span>
              <div className="grid grid-cols-2 gap-2">
                {inCategory.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => onPick(b)}
                    className="flex items-start gap-3 rounded-md border border-divider p-3 text-left hover:border-accent hover:bg-accent/6"
                  >
                    <i className={`ph ph-${b.icon} mt-0.5 text-[18px] text-accent`} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[13px] font-medium">{b.label}</span>
                      <span className="text-[11.5px] text-text/65">{b.description}</span>
                      <span className="text-[10.5px] text-text/50">{b.variants.length} varianten</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SiteBuilder({
  site,
  initialPages,
  canDelete,
}: {
  site: BuilderSite;
  initialPages: PageDTO[];
  canDelete: boolean;
}) {
  const [pages, setPages] = useState<PageDTO[]>(initialPages);
  const [pageId, setPageId] = useState(initialPages[0]?.id ?? "");
  const [level, setLevel] = useState<"pages" | "sections">("sections");
  const [sectionId, setSectionId] = useState<string | null>(initialPages[0]?.sections[0]?.id ?? null);
  const [device, setDevice] = useState<Device>("desktop");
  const [hist, setHist] = useState<Record<string, History>>({});
  const [status, setStatus] = useState<SaveStatus>({ kind: "saved" });
  const [siteStatus, setSiteStatusState] = useState(site.status);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [addingPage, setAddingPage] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; title: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const page = pages.find((p) => p.id === pageId) ?? pages[0];
  const sections = page?.sections ?? [];
  const selected = sections.find((s) => s.id === sectionId) ?? null;
  const selectedBlock = selected ? getBlock(selected.type) : undefined;

  // ── Opslaan ────────────────────────────────────────────────────────────────
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  const dirty = useRef(new Map<string, number>()); // pagina-id → versie van de laatste bewerking
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lock = useRef<Promise<unknown>>(Promise.resolve());

  const scheduleFlush = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), FLUSH_DELAY);
  };

  async function flushNow(): Promise<boolean> {
    clearTimeout(timer.current);
    if (dirty.current.size === 0) return true;
    setStatus({ kind: "saving" });
    for (const [id, v] of [...dirty.current]) {
      const target = pagesRef.current.find((p) => p.id === id);
      if (!target) {
        dirty.current.delete(id);
        continue;
      }
      const problems = sectionsProblems(target.sections);
      if (problems.length > 0) {
        setStatus({ kind: "error", message: `Niet opgeslagen: ${problems[0]}` });
        return false;
      }
      try {
        const res = await savePage(id, target.sections);
        if (!res.ok) {
          setStatus({ kind: "error", message: `Niet opgeslagen: ${res.error}` });
          return false;
        }
      } catch {
        setStatus({ kind: "error", message: "Niet opgeslagen: geen verbinding met de server." });
        return false;
      }
      // Alleen "schoon" als er tijdens het opslaan niets meer is bewerkt.
      if (dirty.current.get(id) === v) dirty.current.delete(id);
    }
    if (dirty.current.size === 0) setStatus({ kind: "saved" });
    else {
      setStatus({ kind: "dirty" });
      scheduleFlush();
    }
    return true;
  }

  /** Slaat alle openstaande pagina's op; parallelle aanroepen wachten op elkaar. */
  function flush(): Promise<boolean> {
    const run = lock.current.then(flushNow);
    lock.current = run.catch(() => undefined);
    return run;
  }

  const markDirty = (id: string) => {
    dirty.current.set(id, ++version.current);
    setStatus({ kind: "dirty" });
    scheduleFlush();
  };

  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current.size > 0) e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  // ── Bewerken van secties ───────────────────────────────────────────────────
  const lastEdit = useRef<{ key: string | null; at: number }>({ key: null, at: 0 });

  /** Zet de secties van de huidige pagina; opeenvolgende bewerkingen met dezelfde `coalesce` vormen één undo-stap. */
  const commit = (next: SectionData[], coalesce?: string) => {
    if (!page) return;
    const now = nowMs();
    const merge = !!coalesce && lastEdit.current.key === coalesce && now - lastEdit.current.at < 1000;
    lastEdit.current = { key: coalesce ?? null, at: now };
    const before = page.sections;
    setHist((h) => {
      const cur = h[page.id] ?? { past: [], future: [] };
      return { ...h, [page.id]: { past: merge ? cur.past : [...cur.past, before].slice(-100), future: [] } };
    });
    setPages((ps) => ps.map((p) => (p.id === page.id ? { ...p, sections: next } : p)));
    markDirty(page.id);
  };

  const history = (page && hist[page.id]) || { past: [], future: [] };
  const undo = () => {
    if (!page || history.past.length === 0) return;
    const prev = history.past[history.past.length - 1];
    setHist((h) => ({ ...h, [page.id]: { past: history.past.slice(0, -1), future: [page.sections, ...history.future] } }));
    setPages((ps) => ps.map((p) => (p.id === page.id ? { ...p, sections: prev } : p)));
    if (!prev.some((s) => s.id === sectionId)) setSectionId(null);
    lastEdit.current = { key: null, at: 0 };
    markDirty(page.id);
  };
  const redo = () => {
    if (!page || history.future.length === 0) return;
    const [next, ...rest] = history.future;
    setHist((h) => ({ ...h, [page.id]: { past: [...history.past, page.sections], future: rest } }));
    setPages((ps) => ps.map((p) => (p.id === page.id ? { ...p, sections: next } : p)));
    if (!next.some((s) => s.id === sectionId)) setSectionId(null);
    lastEdit.current = { key: null, at: 0 };
    markDirty(page.id);
  };

  const addSection = (block: AnyBlock) => {
    const section = newSection(block);
    const at = selected ? sections.findIndex((s) => s.id === selected.id) + 1 : sections.length;
    commit([...sections.slice(0, at), section, ...sections.slice(at)]);
    setSectionId(section.id);
    setLibraryOpen(false);
  };
  const moveSection = (id: string, delta: number) => {
    const i = sections.findIndex((s) => s.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };
  const duplicateSection = (id: string) => {
    const i = sections.findIndex((s) => s.id === id);
    if (i < 0) return;
    const copy = { ...structuredClone(sections[i]), id: newSection(getBlock(sections[i].type)!).id };
    commit([...sections.slice(0, i + 1), copy, ...sections.slice(i + 1)]);
    setSectionId(copy.id);
  };
  const removeSection = (id: string) => {
    commit(sections.filter((s) => s.id !== id));
    if (sectionId === id) setSectionId(null);
  };
  const patchSelected = (patch: Partial<SectionData>, coalesce?: string) => {
    if (!selected) return;
    commit(sections.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)), coalesce);
  };

  // ── Pagina's ───────────────────────────────────────────────────────────────
  const selectPage = (id: string) => {
    setPageId(id);
    setSectionId(pages.find((p) => p.id === id)?.sections[0]?.id ?? null);
    setLevel("sections");
    lastEdit.current = { key: null, at: 0 };
  };

  const submitNewPage = async () => {
    if (!newTitle.trim() || busy) return;
    setBusy(true);
    const res = await addPage(site.id, newTitle);
    setBusy(false);
    if (!res.ok) return setNotice(res.error);
    setPages((ps) => [...ps, res.page]);
    setNewTitle("");
    setAddingPage(false);
    selectPage(res.page.id);
  };

  const submitRename = async () => {
    if (!renaming) return;
    const title = renaming.title.trim();
    const id = renaming.id;
    setRenaming(null);
    if (!title || title === pages.find((p) => p.id === id)?.title) return;
    const res = await renamePage(id, title);
    if (!res.ok) return setNotice(res.error);
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const removePage = async (p: PageDTO) => {
    if (!window.confirm(`Pagina "${p.title}" en al zijn secties verwijderen?`)) return;
    const res = await deletePage(p.id);
    if (!res.ok) return setNotice(res.error);
    dirty.current.delete(p.id);
    const rest = pages.filter((x) => x.id !== p.id);
    setPages(rest);
    if (p.id === pageId) {
      setPageId(rest[0]?.id ?? "");
      setSectionId(rest[0]?.sections[0]?.id ?? null);
      setLevel("pages");
    }
  };

  // ── Voorbeeld en publiceren ────────────────────────────────────────────────
  const openPreview = async () => {
    // Het venster moet synchroon openen (popup-blokkers); daarna pas de URL zetten, als de wijzigingen zijn opgeslagen.
    const win = window.open("about:blank", "_blank");
    const ok = await flush();
    if (!ok) setNotice("Er zijn wijzigingen die niet zijn opgeslagen; het voorbeeld toont de laatst opgeslagen versie.");
    const url = `/websites/${site.id}/voorbeeld/${page?.slug ?? ""}`;
    if (win) win.location.href = url;
    else window.open(url, "_blank");
  };

  const togglePublish = async () => {
    if (busy) return;
    setBusy(true);
    const next = siteStatus === "live" ? "draft" : "live";
    const saved = await flush();
    if (!saved) {
      setBusy(false);
      return setNotice("Los eerst de opslagfout op voordat je de status wijzigt.");
    }
    const res = await setSiteStatus(site.id, next);
    setBusy(false);
    if (!res.ok) return setNotice(res.error);
    setSiteStatusState(next);
    setNotice(next === "live" ? "Website staat op Live." : "Website staat weer op Concept.");
  };

  const removeSite = async () => {
    if (!window.confirm(`Website "${site.name}" met alle pagina's definitief verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    // Er wordt straks toch weg genavigeerd: geen "niet opgeslagen"-waarschuwing meer.
    clearTimeout(timer.current);
    dirty.current.clear();
    await deleteSite(site.id); // stuurt door naar /websites
  };

  // Canvas: links volgen we niet, klikken selecteren alleen.
  const canvasRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (sectionId) canvasRefs.current.get(sectionId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [sectionId]);

  const themeVars = useMemo(() => themeToCssVars(site.theme), [site.theme]);
  const deviceWidth = devices.find((d) => d.id === device)!.width;
  const issues = selected ? sectionIssues(selected) : [];
  const errors = Object.fromEntries(issues.map((i) => [i.path, i.message]));
  const schemas = selectedBlock ? blockJsonSchemas(selectedBlock) : null;

  const statusText =
    status.kind === "saved"
      ? "Opgeslagen"
      : status.kind === "saving"
        ? "Opslaan…"
        : status.kind === "dirty"
          ? "Wijzigingen…"
          : (status.message ?? "Niet opgeslagen");

  if (!page) {
    return <div className="p-8 text-[13px]">Deze website heeft nog geen pagina&apos;s.</div>;
  }

  return (
    <div className="flex h-full min-h-0 gap-px bg-divider">
      {/* Linker paneel: pagina's ↔ secties */}
      <div className="flex w-[228px] flex-none flex-col overflow-hidden bg-bg">
        <div className="flex min-h-9 items-center gap-1 px-3 pb-2 pt-3">
          {level === "sections" ? (
            <button
              type="button"
              className={`${iconBtn} !text-accent-200`}
              title="Terug naar pagina's"
              onClick={() => setLevel("pages")}
            >
              <i className="ph ph-caret-left" />
            </button>
          ) : null}
          <span className="min-w-0 flex-1 truncate font-heading text-[10.5px] uppercase tracking-[0.08em] text-text/60">
            {level === "sections" ? page.title : "Pagina's"}
          </span>
          <button
            type="button"
            className={`${iconBtn} !text-accent-200`}
            title={level === "sections" ? "Sectie toevoegen" : "Pagina toevoegen"}
            onClick={() => (level === "sections" ? setLibraryOpen(true) : setAddingPage((v) => !v))}
          >
            <i className="ph ph-plus" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div
            className="flex h-full w-[200%] transition-transform duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: level === "sections" ? "translateX(-50%)" : "translateX(0)" }}
          >
            {/* pagina's */}
            <div className="flex h-full w-1/2 flex-col gap-px overflow-auto px-2 pb-3">
              {addingPage ? (
                <div className="mb-1 flex gap-1">
                  <input
                    autoFocus
                    className="input min-w-0 flex-1"
                    style={{ fontSize: 11.5, padding: "5px 8px" }}
                    placeholder="Titel van de pagina"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void submitNewPage();
                      if (e.key === "Escape") setAddingPage(false);
                    }}
                  />
                  <button type="button" className="btn btn-primary" style={{ fontSize: 11.5 }} disabled={busy} onClick={() => void submitNewPage()}>
                    Toevoegen
                  </button>
                </div>
              ) : null}
              {pages.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 rounded-sm px-2 py-[7px] text-[11px] ${p.id === pageId ? on : off}`}
                >
                  {renaming?.id === p.id ? (
                    <input
                      autoFocus
                      className="input min-w-0 flex-1"
                      style={{ fontSize: 11.5, padding: "3px 6px" }}
                      value={renaming.title}
                      onChange={(e) => setRenaming({ id: p.id, title: e.target.value })}
                      onBlur={() => void submitRename()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void submitRename();
                        if (e.key === "Escape") setRenaming(null);
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                      onClick={() => selectPage(p.id)}
                    >
                      <i className={`ph ph-${pageIcon(p.slug)} flex-none text-[13px]`} />
                      <span className="min-w-0 flex-1 truncate">{p.title}</span>
                    </button>
                  )}
                  {renaming?.id === p.id ? null : (
                    <>
                      <button type="button" className={iconBtn} title="Hernoemen" onClick={() => setRenaming({ id: p.id, title: p.title })}>
                        <i className="ph ph-pencil-simple" />
                      </button>
                      {p.slug !== "" ? (
                        <button type="button" className={iconBtn} title="Pagina verwijderen" onClick={() => void removePage(p)}>
                          <i className="ph ph-trash" />
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* secties van de gekozen pagina */}
            <div className="flex h-full w-1/2 flex-col gap-px overflow-auto px-2 pb-3">
              {sections.length === 0 ? (
                <div className="flex flex-col items-start gap-2 px-2 py-3 text-[11.5px] text-text/65">
                  Deze pagina heeft nog geen secties.
                  <button type="button" className="btn btn-secondary" style={{ fontSize: 11.5 }} onClick={() => setLibraryOpen(true)}>
                    <i className="ph ph-plus" /> Sectie toevoegen
                  </button>
                </div>
              ) : null}
              {sections.map((s, i) => {
                const b = getBlock(s.type);
                const heading = headingOf(s);
                return (
                  <div key={s.id} className={`flex items-center gap-1.5 rounded-sm px-2 py-[7px] text-[11px] ${s.id === sectionId ? on : off}`}>
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-1.5 text-left" onClick={() => setSectionId(s.id)}>
                      <i className={`ph ph-${b?.icon ?? "warning"} flex-none text-[13px]`} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{b?.label ?? s.type}</span>
                        {heading ? <span className="truncate text-[10px] opacity-60">{heading}</span> : null}
                      </span>
                    </button>
                    <button type="button" className={iconBtn} title="Omhoog" disabled={i === 0} onClick={() => moveSection(s.id, -1)}>
                      <i className="ph ph-arrow-up" />
                    </button>
                    <button type="button" className={iconBtn} title="Omlaag" disabled={i === sections.length - 1} onClick={() => moveSection(s.id, 1)}>
                      <i className="ph ph-arrow-down" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Midden: canvas */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-900">
        <div className="flex min-h-[46px] items-center gap-3 border-b border-divider px-4 py-2">
          <div className="flex items-center gap-0.5 rounded-md bg-text/5 p-0.5">
            {devices.map((d) => (
              <button
                key={d.id}
                type="button"
                title={d.label}
                onClick={() => setDevice(d.id)}
                className={`grid h-6 w-[26px] place-items-center rounded-sm text-[13px] ${d.id === device ? on : "text-text/70"}`}
              >
                <i className={`ph ph-${d.icon}`} />
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-[11.5px] text-text/66">
            <i className="ph ph-link-simple flex-none text-[13px]" />
            <span className="min-w-0 truncate">
              {site.name} <span className="text-text/45">·</span> /{page.slug}
            </span>
            <span className={siteStatus === "live" ? "tag tag-accent" : "tag tag-neutral"}>
              {siteStatus === "live" ? "Live" : "Concept"}
            </span>
          </div>
          <div className="flex flex-none items-center gap-2">
            <span
              className={`max-w-[260px] truncate text-[11px] ${status.kind === "error" ? "text-danger" : "text-text/60"}`}
              title={status.kind === "error" ? status.message : undefined}
              aria-live="polite"
            >
              {statusText}
            </span>
            <button type="button" className="btn btn-icon btn-secondary" title="Ongedaan maken" disabled={history.past.length === 0} onClick={undo}>
              <i className="ph ph-arrow-counter-clockwise" />
            </button>
            <button type="button" className="btn btn-icon btn-secondary" title="Opnieuw" disabled={history.future.length === 0} onClick={redo}>
              <i className="ph ph-arrow-clockwise" />
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => void openPreview()}>
              <i className="ph ph-eye" /> Voorbeeld
            </button>
            <button
              type="button"
              className={`btn ${siteStatus === "live" ? "btn-secondary" : "btn-primary"}`}
              style={{ fontSize: 12 }}
              disabled={busy}
              onClick={() => void togglePublish()}
            >
              <i className={`ph ph-${siteStatus === "live" ? "arrow-u-up-left" : "rocket-launch"}`} />{" "}
              {siteStatus === "live" ? "Op concept zetten" : "Publiceren"}
            </button>
          </div>
        </div>

        {notice ? (
          <div className="flex items-center gap-2 border-b border-divider bg-accent/10 px-4 py-1.5 text-[12px]" role="status">
            <i className="ph ph-info text-accent" />
            <span className="flex-1">{notice}</span>
            <button type="button" className="btn btn-ghost size-5 !p-0" onClick={() => setNotice(null)} title="Sluiten">
              <i className="ph ph-x text-[11px]" />
            </button>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 justify-center overflow-auto p-4">
          <div
            className="self-start overflow-hidden rounded-md bg-white shadow-[var(--shadow-lg)]"
            style={{ ...themeVars, width: deviceWidth, maxWidth: "100%", background: "var(--var-color-white)" }}
            onClickCapture={(e) => {
              if ((e.target as HTMLElement).closest("a")) e.preventDefault();
            }}
          >
            {sections.length === 0 ? (
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="flex min-h-[240px] w-full flex-col items-center justify-center gap-2 text-[13px] text-text/60"
              >
                <i className="ph ph-plus-circle text-[28px]" />
                Voeg je eerste sectie toe
              </button>
            ) : (
              sections.map((s) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    if (el) canvasRefs.current.set(s.id, el);
                    else canvasRefs.current.delete(s.id);
                  }}
                  className="relative cursor-pointer"
                  onClick={() => setSectionId(s.id)}
                >
                  <CanvasSection section={s} />
                  <div
                    className="pointer-events-none absolute inset-0 hover:outline-2"
                    style={{ outline: s.id === sectionId ? "2px solid var(--color-accent)" : "none", outlineOffset: -2 }}
                  />
                  {s.id === sectionId ? (
                    <div className="pointer-events-none absolute left-0 top-0 bg-accent px-2 py-[3px] text-[10.5px] tracking-[0.04em] text-neutral-900">
                      {getBlock(s.type)?.label ?? s.type}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rechter paneel: instellingen van de gekozen sectie, gegenereerd uit het block-schema */}
      <div className="flex w-[300px] flex-none flex-col bg-bg">
        <div className="flex flex-col gap-0.5 px-4 pb-2 pt-3">
          <span className="font-heading text-[10.5px] uppercase tracking-[0.08em] text-text/60">Instellingen</span>
          <span className="truncate text-[11px] text-text/70">
            {selectedBlock ? `${selectedBlock.label} · sectie-instellingen` : "Geen sectie gekozen"}
          </span>
        </div>

        {selected && selectedBlock && schemas ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 pb-6 pt-2">
            <div className="flex items-center gap-1">
              <button type="button" className="btn btn-secondary flex-1" style={{ fontSize: 11.5, justifyContent: "center" }} onClick={() => duplicateSection(selected.id)}>
                <i className="ph ph-copy" /> Dupliceren
              </button>
              <button type="button" className="btn btn-secondary flex-1 !text-danger" style={{ fontSize: 11.5, justifyContent: "center" }} onClick={() => removeSection(selected.id)}>
                <i className="ph ph-trash" /> Verwijderen
              </button>
            </div>

            {issues.length > 0 ? (
              <div className="rounded-md border border-danger/40 bg-danger/8 p-2 text-[11px] text-danger">
                Deze sectie is nog niet geldig en wordt pas opgeslagen als de gemarkeerde velden kloppen.
              </div>
            ) : null}

            <label className="field" style={{ gap: 4 }}>
              <span className="text-[11px]">Variant</span>
              <select
                className="input"
                style={{ fontSize: 11.5, padding: "6px 8px" }}
                value={selected.variant}
                onChange={(e) => patchSelected({ variant: e.target.value })}
              >
                {selectedBlock.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            <SectionPart title="Inhoud">
              <SchemaFields
                schema={schemas.content}
                value={selected.content}
                root="content"
                errors={errors}
                onChange={(next) => patchSelected({ content: next }, `content:${selected.id}`)}
              />
            </SectionPart>
            <SectionPart title="Uiterlijk">
              <SchemaFields
                schema={schemas.settings}
                value={selected.settings ?? {}}
                root="settings"
                errors={errors}
                onChange={(next) => patchSelected({ settings: next }, `settings:${selected.id}`)}
              />
            </SectionPart>

            <div className="flex flex-col gap-1.5 border-t border-divider pt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-accent-200">
                <i className="ph ph-sparkle text-[12px]" /> AI-aanpassing
              </span>
              <textarea
                className="input"
                rows={3}
                disabled
                placeholder="Nog niet beschikbaar"
                style={{ fontSize: 11.5, padding: "6px 8px", resize: "vertical" }}
              />
              <button type="button" className="btn btn-primary btn-block" style={{ fontSize: 11.5 }} disabled>
                Toepassen
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 text-[12px] text-text/60">
            Klik op een sectie in het canvas of in de lijst links om de inhoud en het uiterlijk aan te passen.
            <div className="mt-3">
              <Link href="/websites" className="text-accent-200 underline">
                Terug naar alle websites
              </Link>
            </div>
            {canDelete ? (
              <button type="button" className="btn btn-secondary mt-8 !text-danger" onClick={() => void removeSite()}>
                <i className="ph ph-trash" /> Website verwijderen
              </button>
            ) : null}
          </div>
        )}
      </div>

      {libraryOpen ? <Library onPick={addSection} onClose={() => setLibraryOpen(false)} /> : null}
    </div>
  );
}

function SectionPart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-divider pt-3">
      <span className="font-heading text-[10.5px] uppercase tracking-[0.08em] text-text/60">{title}</span>
      {children}
    </div>
  );
}
