"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { listVersions, rollbackSite, type VersionItem } from "./publish";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; versions: VersionItem[] };

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** Overzicht van de bewaarde versies van een site; een oudere versie kan weer live worden gezet. */
export function VersionsDialog({ siteId, onClose, onChanged }: { siteId: string; onClose: () => void; onChanged: () => void }) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [problem, setProblem] = useState<string | null>(null);
  const [working, setWorking] = useState<number | null>(null);

  async function reload() {
    try {
      const res = await listVersions(siteId);
      setLoad(res.ok ? { status: "ready", versions: res.versions } : { status: "error", message: res.error });
    } catch {
      setLoad({ status: "error", message: "De versies konden niet worden geladen." });
    }
  }

  useEffect(() => {
    let stale = false;
    listVersions(siteId)
      .then((res) => {
        if (!stale) setLoad(res.ok ? { status: "ready", versions: res.versions } : { status: "error", message: res.error });
      })
      .catch(() => {
        if (!stale) setLoad({ status: "error", message: "De versies konden niet worden geladen." });
      });
    return () => {
      stale = true;
    };
  }, [siteId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function rollback(v: VersionItem) {
    if (!window.confirm(`Versie ${v.version} live zetten? Bezoekers zien dan direct die versie. Je werkkopie blijft zoals hij is.`)) return;
    setWorking(v.version);
    setProblem(null);
    try {
      const res = await rollbackSite(siteId, v.version);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      onChanged();
      await reload();
    } catch {
      setProblem("Terugzetten is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setWorking(null);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label="Versies">
      <div
        className="flex max-h-[80vh] w-full max-w-[560px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <h4 className="!mb-0 flex-1">Versies</h4>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten" autoFocus>
            <i className="ph ph-x" />
          </button>
        </div>
        <p className="text-muted m-0 text-[12.5px]">
          Elke keer dat je publiceert, wordt de site vastgelegd als een nieuwe versie. Een versie zelf verandert nooit; terugzetten laat alleen een oudere versie live gaan. De laatste 20 versies worden bewaard.
        </p>

        {problem ? (
          <div role="alert" className="rounded-md border border-danger px-3 py-2 text-[12px] text-danger">
            {problem}
          </div>
        ) : null}
        {load.status === "loading" ? <p className="text-muted m-0 text-[13px]">Laden…</p> : null}
        {load.status === "error" ? <p className="m-0 text-[13px] text-danger">{load.message}</p> : null}
        {load.status === "ready" && load.versions.length === 0 ? <p className="text-muted m-0 text-[13px]">Deze website is nog nooit gepubliceerd.</p> : null}

        {load.status === "ready" && load.versions.length > 0 ? (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {load.versions.map((v) => (
              <li key={v.version} className="flex items-center gap-3 rounded-md border border-divider px-3 py-2.5">
                <span className="w-9 flex-none text-[13px] font-medium">v{v.version}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[12.5px]">{formatDate(v.createdAt)}</span>
                  <span className="truncate text-[11px] text-text/60">
                    {v.createdBy ?? "Onbekend"}
                    {v.note ? ` · ${v.note}` : ""}
                  </span>
                </span>
                {v.live ? (
                  <span className="tag tag-accent">Live</span>
                ) : (
                  <button type="button" className="btn btn-secondary" style={{ fontSize: 11.5 }} disabled={working !== null} onClick={() => void rollback(v)}>
                    <i className={`ph ${working === v.version ? "ph-spinner" : "ph-arrow-counter-clockwise"}`} aria-hidden="true" /> Live zetten
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
