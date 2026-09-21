"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import { CATEGORIES, type AnyBlock, type SectionData } from "@/blocks/contract";
import { blocks, getBlock } from "@/blocks/registry";
import { themeToCssVars, type SiteTheme } from "@/blocks/theme";
import type { SiteLayout } from "@/db/schema";
import { addPage, deletePage, deleteSite, renamePage, saveLayout, savePage, type PageDTO, type PageSettings } from "./actions";
import { fetchPublishInfo, publishSite, unpublishSite } from "./publish";
import type { PublishInfo } from "./publishing";
import { DomainsDialog } from "./DomainsDialog";
import { ThemeFonts } from "@/lib/theme-fonts";
import { KitDialog } from "./KitDialog";
import { VersionsDialog } from "./VersionsDialog";
import { isSlot, slotBlockSlugs, slotKeys, slots, type Slot } from "./layout-slots";
import { PageSettingsForm } from "./PageSettingsForm";
import { UploadSiteContext } from "./ImageUpload";
import { blockJsonSchemas, SchemaFields } from "./SchemaForm";
import { describeIssue, newSection, sectionIssues, sectionsProblems } from "./sections";
import { SiteFrame } from "./SiteFrame";

export type BuilderSite = {
  id: string;
  name: string;
  slug: string;
  /** Het thema zoals het rendert: de kit met de eigen afwijkingen van de site erbovenop. */
  theme: SiteTheme;
  /** De design kit van de site, of null als er geen is. */
  kit: { id: string; name: string } | null;
  customerId: string;
  layout: SiteLayout;
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
  const c = s.content as { heading?: unknown; brand?: unknown } | null;
  const h = c?.heading ?? c?.brand;
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

/** De secties van één plek (pagina, header of footer) in het canvas; klikken selecteert en schakelt naar die plek. */
function CanvasArea({
  list,
  area,
  selectedId,
  onPick,
  registerRef,
}: {
  list: SectionData[];
  area: Slot | null;
  selectedId: string | null;
  onPick: (area: Slot | null, id: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  return (
    <>
      {list.map((s) => (
        <div key={s.id} ref={(el) => registerRef(s.id, el)} className="relative cursor-pointer" onClick={() => onPick(area, s.id)}>
          <CanvasSection section={s} />
          <div
            className="pointer-events-none absolute inset-0 hover:outline-2"
            style={{ outline: s.id === selectedId ? "2px solid var(--color-accent)" : "none", outlineOffset: -2 }}
          />
          {s.id === selectedId ? (
            <div className="pointer-events-none absolute left-0 top-0 bg-accent px-2 py-[3px] text-[10.5px] tracking-[0.04em] text-neutral-900">
              {area ? `${slots[area].label} · ` : ""}
              {getBlock(s.type)?.label ?? s.type}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}

function Library({ available, onPick, onClose }: { available: AnyBlock[]; onPick: (block: AnyBlock) => void; onClose: () => void }) {
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
          const inCategory = available.filter((b) => b.category === category && b.status !== "verouderd");
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
  initialPublish,
  initialPageId,
}: {
  site: BuilderSite;
  initialPages: PageDTO[];
  canDelete: boolean;
  initialPublish: PublishInfo;
  /** De pagina waarmee de builder opent (bijv. vanuit de zoekbalk); standaard de eerste. */
  initialPageId?: string;
}) {
  const startPage = initialPages.find((p) => p.id === initialPageId) ?? initialPages[0];
  const [pages, setPages] = useState<PageDTO[]>(initialPages);
  const [pageId, setPageId] = useState(startPage?.id ?? "");
  const [level, setLevel] = useState<"pages" | "sections">("sections");
  const [sectionId, setSectionId] = useState<string | null>(startPage?.sections[0]?.id ?? null);
  const [device, setDevice] = useState<Device>("desktop");
  const [hist, setHist] = useState<Record<string, History>>({});
  const [status, setStatus] = useState<SaveStatus>({ kind: "saved" });
  const [publish, setPublish] = useState<PublishInfo>(initialPublish);
  const router = useRouter();
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [addingPage, setAddingPage] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; title: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [layout, setLayout] = useState<SiteLayout>(site.layout);
  // Welke sitebrede plek (header/footer) wordt bewerkt; null = de gekozen pagina.
  const [editing, setEditing] = useState<Slot | null>(null);
  const [rightTab, setRightTab] = useState<"section" | "page">("section");

  const uploadTarget = useMemo(() => ({ siteId: site.id, canDelete }), [site.id, canDelete]);

  const page = pages.find((p) => p.id === pageId) ?? pages[0];
  // Alles wat bewerkt, opgeslagen en ongedaan gemaakt wordt hoort bij één "plek": een pagina-id, "header" of "footer".
  const areaKey: string = editing ?? page?.id ?? "";
  const sections = editing ? layout[editing] : (page?.sections ?? []);
  const selected = sections.find((s) => s.id === sectionId) ?? null;
  const selectedBlock = selected ? getBlock(selected.type) : undefined;

  // ── Opslaan ────────────────────────────────────────────────────────────────
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  const layoutRef = useRef(layout);
  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);
  const dirty = useRef(new Map<string, number>()); // plek (pagina-id, "header" of "footer") → versie van de laatste bewerking
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
    for (const [key, v] of [...dirty.current]) {
      const slot = isSlot(key) ? key : null;
      const targetPage = slot ? undefined : pagesRef.current.find((p) => p.id === key);
      const target = slot ? layoutRef.current[slot] : targetPage?.sections;
      if (!target) {
        dirty.current.delete(key);
        continue;
      }
      const problems = sectionsProblems(target);
      if (problems.length > 0) {
        setStatus({ kind: "error", message: `Niet opgeslagen: ${problems[0]}` });
        return false;
      }
      try {
        const res = slot ? await saveLayout(site.id, slot, target) : await savePage(key, target);
        if (!res.ok) {
          setStatus({ kind: "error", message: `Niet opgeslagen: ${res.error}` });
          return false;
        }
      } catch {
        setStatus({ kind: "error", message: "Niet opgeslagen: geen verbinding met de server." });
        return false;
      }
      // Alleen "schoon" als er tijdens het opslaan niets meer is bewerkt.
      if (dirty.current.get(key) === v) dirty.current.delete(key);
    }
    if (dirty.current.size === 0) {
      setStatus({ kind: "saved" });
      void refreshPublish();
    } else {
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

  const setAreaSections = (key: string, next: SectionData[]) => {
    if (isSlot(key)) setLayout((l) => ({ ...l, [key]: next }));
    else setPages((ps) => ps.map((p) => (p.id === key ? { ...p, sections: next } : p)));
  };

  /** Zet de secties van de bewerkte plek; opeenvolgende bewerkingen met dezelfde `coalesce` vormen één undo-stap. */
  const commit = (next: SectionData[], coalesce?: string) => {
    if (!areaKey) return;
    const now = nowMs();
    const merge = !!coalesce && lastEdit.current.key === coalesce && now - lastEdit.current.at < 1000;
    lastEdit.current = { key: coalesce ?? null, at: now };
    const before = sections;
    setHist((h) => {
      const cur = h[areaKey] ?? { past: [], future: [] };
      return { ...h, [areaKey]: { past: merge ? cur.past : [...cur.past, before].slice(-100), future: [] } };
    });
    setAreaSections(areaKey, next);
    markDirty(areaKey);
  };

  const history = (areaKey && hist[areaKey]) || { past: [], future: [] };
  const undo = () => {
    if (!areaKey || history.past.length === 0) return;
    const prev = history.past[history.past.length - 1];
    setHist((h) => ({ ...h, [areaKey]: { past: history.past.slice(0, -1), future: [sections, ...history.future] } }));
    setAreaSections(areaKey, prev);
    if (!prev.some((s) => s.id === sectionId)) setSectionId(null);
    lastEdit.current = { key: null, at: 0 };
    markDirty(areaKey);
  };
  const redo = () => {
    if (!areaKey || history.future.length === 0) return;
    const [next, ...rest] = history.future;
    setHist((h) => ({ ...h, [areaKey]: { past: [...history.past, sections], future: rest } }));
    setAreaSections(areaKey, next);
    if (!next.some((s) => s.id === sectionId)) setSectionId(null);
    lastEdit.current = { key: null, at: 0 };
    markDirty(areaKey);
  };

  const addSection = (block: AnyBlock) => {
    const section = newSection(block);
    const at = selected ? sections.findIndex((s) => s.id === selected.id) + 1 : sections.length;
    commit([...sections.slice(0, at), section, ...sections.slice(at)]);
    setSectionId(section.id);
    setRightTab("section");
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
    setEditing(null);
    setPageId(id);
    setSectionId(pages.find((p) => p.id === id)?.sections[0]?.id ?? null);
    setRightTab("section");
    setLevel("sections");
    lastEdit.current = { key: null, at: 0 };
  };

  const selectSlot = (slot: Slot) => {
    setEditing(slot);
    setSectionId(layout[slot][0]?.id ?? null);
    setRightTab("section");
    setLevel("sections");
    lastEdit.current = { key: null, at: 0 };
  };

  /** Klik op een sectie in het canvas of de lijst; schakelt zo nodig tussen de pagina, de header en de footer. */
  const pickSection = (area: Slot | null, id: string) => {
    setEditing(area);
    setSectionId(id);
    setRightTab("section");
  };

  const submitNewPage = async () => {
    if (!newTitle.trim() || busy) return;
    setBusy(true);
    const res = await addPage(site.id, newTitle);
    setBusy(false);
    if (!res.ok) return setNotice(res.error);
    setPages((ps) => [...ps, res.page]);
    void refreshPublish();
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
    void refreshPublish();
  };

  const removePage = async (p: PageDTO) => {
    if (!window.confirm(`Pagina "${p.title}" en al zijn secties verwijderen?`)) return;
    const res = await deletePage(p.id);
    if (!res.ok) return setNotice(res.error);
    dirty.current.delete(p.id);
    void refreshPublish();
    const rest = pages.filter((x) => x.id !== p.id);
    setPages(rest);
    if (p.id === pageId) {
      setPageId(rest[0]?.id ?? "");
      setSectionId(rest[0]?.sections[0]?.id ?? null);
      setEditing(null);
      setLevel("pages");
    }
  };

  const pageSettingsSaved = (id: string, settings: PageSettings) => {
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, ...settings } : p)));
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

  /** De publicatiestatus opnieuw bepalen op de server (is de werkkopie nog gelijk aan de live versie?). */
  async function refreshPublish() {
    const res = await fetchPublishInfo(site.id);
    if (res.ok) setPublish(res.info);
  }

  const doPublish = async () => {
    if (busy) return;
    setBusy(true);
    const saved = await flush();
    if (!saved) {
      setBusy(false);
      return setNotice("Los eerst de opslagfout op voordat je publiceert.");
    }
    const res = await publishSite(site.id);
    setBusy(false);
    if (!res.ok) return setNotice(res.error);
    setNotice(res.unchanged ? `Er zijn geen wijzigingen sinds versie ${res.version}; de website staat op Live.` : `Versie ${res.version} staat live.`);
    await refreshPublish();
  };

  const doUnpublish = async () => {
    if (busy) return;
    if (!window.confirm("De website offline zetten? Bezoekers zien hem dan niet meer. Je versies blijven bewaard.")) return;
    setBusy(true);
    const res = await unpublishSite(site.id);
    setBusy(false);
    if (!res.ok) return setNotice(res.error);
    setNotice("Website staat weer op Concept.");
    await refreshPublish();
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
  const registerRef = (id: string, el: HTMLDivElement | null) => {
    if (el) canvasRefs.current.set(id, el);
    else canvasRefs.current.delete(id);
  };
  useEffect(() => {
    if (sectionId) canvasRefs.current.get(sectionId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [sectionId]);

  const available = editing
    ? blocks.filter((b) => slots[editing].allowed.includes(b.slug))
    : blocks.filter((b) => !slotBlockSlugs.has(b.slug));
  const pagePaths = pages.map((p) => `/${p.slug}`);
  // Zonder gekozen sectie (of in de header/footer) is er alleen het paginatabblad, respectievelijk het sectietabblad.
  const tab = editing ? "section" : !selected ? "page" : rightTab;

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

  const siteActions = (
    <div className="mt-3">
      <Link href="/websites" className="text-accent-200 underline">
        Terug naar alle websites
      </Link>
      {canDelete ? (
        <div>
          <button type="button" className="btn btn-secondary mt-8 !text-danger" onClick={() => void removeSite()}>
            <i className="ph ph-trash" /> Website verwijderen
          </button>
        </div>
      ) : null}
    </div>
  );

  const slotPlaceholder = (slot: Slot) => (
    <button
      type="button"
      onClick={() => {
        selectSlot(slot);
        setLibraryOpen(true);
      }}
      className="flex w-full items-center justify-center gap-1.5 border-y border-dashed border-divider py-2 text-[11px] text-text/55 hover:text-accent"
    >
      <i className="ph ph-plus" /> {slots[slot].label} toevoegen
    </button>
  );

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
            {level === "sections" ? (editing ? slots[editing].label : page.title) : "Pagina's"}
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
                  className={`flex items-center gap-1.5 rounded-sm px-2 py-[7px] text-[11px] ${!editing && p.id === pageId ? on : off}`}
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

              <div className="mt-3 px-2 pb-1 text-[10px] uppercase tracking-[0.08em] text-text/50">Op alle pagina&apos;s</div>
              {slotKeys.map((k) => (
                <div key={k} className={`flex items-center gap-1.5 rounded-sm px-2 py-[7px] text-[11px] ${editing === k ? on : off}`}>
                  <button type="button" className="flex min-w-0 flex-1 items-center gap-1.5 text-left" onClick={() => selectSlot(k)} title={slots[k].description}>
                    <i className={`ph ph-${k === "header" ? "arrow-line-up" : "arrow-line-down"} flex-none text-[13px]`} />
                    <span className="min-w-0 flex-1 truncate">{slots[k].label}</span>
                    <span className="text-[10px] opacity-60">{layout[k].length}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* secties van de gekozen pagina, header of footer */}
            <div className="flex h-full w-1/2 flex-col gap-px overflow-auto px-2 pb-3">
              {sections.length === 0 ? (
                <div className="flex flex-col items-start gap-2 px-2 py-3 text-[11.5px] text-text/65">
                  {editing ? `De ${slots[editing].label.toLowerCase()} is nog leeg.` : "Deze pagina heeft nog geen secties."}
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
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-1.5 text-left" onClick={() => pickSection(editing, s.id)}>
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
            <span className={publish.live ? "tag tag-accent" : "tag tag-neutral"}>
              {publish.live ? `Live · v${publish.version}` : "Concept"}
            </span>
            {publish.live && publish.changed ? <span className="tag tag-outline">Niet-gepubliceerde wijzigingen</span> : null}
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
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setKitOpen(true)} title={site.kit ? `Design kit: ${site.kit.name}` : "Design kit kiezen"}>
              <i className="ph ph-palette" /> {site.kit?.name ?? "Design kit"}
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setDomainsOpen(true)} title="Eigen domeinen van de klant">
              <i className="ph ph-globe" /> Domeinen
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setVersionsOpen(true)} title="Versies en terugrollen">
              <i className="ph ph-clock-counter-clockwise" /> Versies
            </button>
            {publish.live ? (
              <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} disabled={busy} onClick={() => void doUnpublish()}>
                <i className="ph ph-arrow-u-up-left" /> Op concept zetten
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: 12 }}
              disabled={busy || (publish.live && !publish.changed)}
              title={publish.live && !publish.changed ? "Er zijn geen wijzigingen om te publiceren" : undefined}
              onClick={() => void doPublish()}
            >
              <i className="ph ph-rocket-launch" /> Publiceren
            </button>
          </div>
        </div>

        {domainsOpen ? <DomainsDialog siteId={site.id} canDelete={canDelete} onClose={() => setDomainsOpen(false)} /> : null}
        {kitOpen ? (
          <KitDialog
            siteId={site.id}
            onClose={() => setKitOpen(false)}
            onChanged={() => {
              // Het canvas krijgt het nieuwe thema van de server; en de vergelijking met de live versie verandert mee (het thema zit in de momentopname).
              router.refresh();
              void refreshPublish();
            }}
          />
        ) : null}
        {versionsOpen ? <VersionsDialog siteId={site.id} onClose={() => setVersionsOpen(false)} onChanged={() => void refreshPublish()} /> : null}

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
            className="isolate self-start overflow-hidden rounded-md bg-white shadow-[var(--shadow-lg)]"
            style={{ ...themeVars, width: deviceWidth, maxWidth: "100%", background: "var(--var-color-white)" }}
            onClickCapture={(e) => {
              if ((e.target as HTMLElement).closest("a")) e.preventDefault();
            }}
          >
            <ThemeFonts theme={site.theme} />
            <SiteFrame
              embedded
              header={layout.header.length > 0 ? <CanvasArea list={layout.header} area="header" selectedId={sectionId} onPick={pickSection} registerRef={registerRef} /> : slotPlaceholder("header")}
              footer={layout.footer.length > 0 ? <CanvasArea list={layout.footer} area="footer" selectedId={sectionId} onPick={pickSection} registerRef={registerRef} /> : slotPlaceholder("footer")}
            >
              {page.sections.length === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    selectPage(page.id);
                    setLibraryOpen(true);
                  }}
                  className="flex min-h-[240px] w-full flex-col items-center justify-center gap-2 text-[13px] text-text/60"
                >
                  <i className="ph ph-plus-circle text-[28px]" />
                  Voeg je eerste sectie toe
                </button>
              ) : (
                <CanvasArea list={page.sections} area={null} selectedId={sectionId} onPick={pickSection} registerRef={registerRef} />
              )}
            </SiteFrame>
          </div>
        </div>
      </div>

      {/* Rechter paneel: sectie-instellingen (gegenereerd uit het block-schema) of pagina-instellingen (SEO) */}
      <div className="flex w-[300px] flex-none flex-col bg-bg">
        <div className="flex flex-col gap-2 px-4 pb-2 pt-3">
          <span className="font-heading text-[10.5px] uppercase tracking-[0.08em] text-text/60">Instellingen</span>
          {editing ? (
            <span className="truncate text-[11px] text-text/70">
              {slots[editing].label} · {selectedBlock ? selectedBlock.label : "geen sectie gekozen"}
            </span>
          ) : (
            <div className="seg flex text-[11px]">
              <button
                type="button"
                className="seg-opt"
                aria-pressed={tab === "section"}
                disabled={!selected}
                style={{ flex: "1 1 0", minWidth: 0, padding: "5px 2px" }}
                onClick={() => setRightTab("section")}
              >
                Sectie
              </button>
              <button
                type="button"
                className="seg-opt"
                aria-pressed={tab === "page"}
                style={{ flex: "1 1 0", minWidth: 0, padding: "5px 2px" }}
                onClick={() => setRightTab("page")}
              >
                Pagina
              </button>
            </div>
          )}
        </div>

        {/* Suggesties voor alle link-velden: de pagina's van deze site. */}
        <datalist id="site-paths">
          {pagePaths.map((path) => (
            <option key={path} value={path} />
          ))}
        </datalist>

        {tab === "page" && !editing ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 pb-6 pt-2">
            <PageSettingsForm key={page.id} page={page} siteName={site.name} onSaved={(settings) => pageSettingsSaved(page.id, settings)} />
            {siteActions}
          </div>
        ) : selected && selectedBlock && schemas ? (
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
              <UploadSiteContext value={uploadTarget}>
                <SchemaFields
                  schema={schemas.content}
                  value={selected.content}
                  root="content"
                  errors={errors}
                  onChange={(next) => patchSelected({ content: next }, `content:${selected.id}`)}
                />
              </UploadSiteContext>
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
            {siteActions}
          </div>
        )}
      </div>

      {libraryOpen ? <Library available={available} onPick={addSection} onClose={() => setLibraryOpen(false)} /> : null}
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
