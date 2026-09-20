"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { deleteMedia, listMedia, type MediaItem } from "./media";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; items: MediaItem[] };

const formatBytes = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const formatDate = (iso: string) => new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

/** Venster met alle eerder geüploade beelden van een website; een beeld kiezen vult het afbeeldingsveld. */
export function MediaLibrary({
  siteId,
  canDelete,
  currentUrl,
  onPick,
  onClose,
}: {
  siteId: string;
  canDelete: boolean;
  /** Het beeld dat nu in het veld staat: wordt gemarkeerd en kan niet verwijderd worden. */
  currentUrl: string;
  onPick: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [problem, setProblem] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    listMedia(siteId)
      .then((res) => {
        if (!stale) setLoad(res.ok ? { status: "ready", items: res.items } : { status: "error", message: res.error });
      })
      .catch(() => {
        if (!stale) setLoad({ status: "error", message: "De bibliotheek kon niet worden geladen." });
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

  async function remove(item: MediaItem) {
    const name = item.filename ?? "dit beeld";
    if (!window.confirm(`"${name}" definitief verwijderen uit de bibliotheek? Dit kan niet ongedaan worden gemaakt.`)) return;
    setDeleting(item.id);
    setProblem(null);
    try {
      const res = await deleteMedia(siteId, item.id);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      setLoad((l) => (l.status === "ready" ? { status: "ready", items: l.items.filter((i) => i.id !== item.id) } : l));
    } catch {
      setProblem("Verwijderen is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setDeleting(null);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label="Mediabibliotheek">
      <div
        className="flex max-h-[85vh] w-full max-w-[860px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <h4 className="!mb-0 flex-1">Mediabibliotheek</h4>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten" autoFocus>
            <i className="ph ph-x" />
          </button>
        </div>

        {problem ? (
          <div role="alert" className="rounded-md border border-danger px-3 py-2 text-[12px] text-danger">
            {problem}
          </div>
        ) : null}

        {load.status === "loading" ? <p className="text-muted m-0 text-[13px]">Laden…</p> : null}
        {load.status === "error" ? <p className="m-0 text-[13px] text-danger">{load.message}</p> : null}
        {load.status === "ready" && load.items.length === 0 ? (
          <p className="text-muted m-0 text-[13px]">Nog geen afbeeldingen voor deze website. Upload er een via een afbeeldingsveld; die verschijnt hier daarna vanzelf.</p>
        ) : null}

        {load.status === "ready" && load.items.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4">
            {load.items.map((item) => {
              const current = item.url === currentUrl;
              const blocked = current ? "Dit beeld staat nu in het veld." : item.usedIn > 0 ? `Wordt nog gebruikt (${item.usedIn}×).` : null;
              return (
                <li key={item.id} className={`flex flex-col overflow-hidden rounded-md border ${current ? "border-accent" : "border-divider"}`}>
                  <button type="button" onClick={() => onPick(item)} className="flex flex-col text-left hover:bg-accent/6" title="Dit beeld gebruiken">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      srcSet={item.srcset}
                      sizes="200px"
                      width={item.width}
                      height={item.height}
                      alt=""
                      loading="lazy"
                      className="h-28 w-full bg-neutral-900 object-contain"
                    />
                    <span className="flex flex-col gap-0.5 p-2">
                      <span className="truncate text-[12px] font-medium">{item.filename ?? "Naamloos"}</span>
                      <span className="text-[10.5px] text-text/60">
                        {item.width}×{item.height} · {formatBytes(item.bytes)} · {formatDate(item.createdAt)}
                      </span>
                      <span className={`text-[10.5px] ${current ? "text-accent" : "text-text/60"}`}>
                        {current ? "Huidige afbeelding" : item.usedIn > 0 ? `In gebruik (${item.usedIn}×)` : "Niet in gebruik"}
                      </span>
                    </span>
                  </button>
                  {canDelete ? (
                    <button
                      type="button"
                      className="btn btn-ghost !justify-start border-t border-divider !rounded-none !px-2 !py-1.5 text-[11.5px]"
                      disabled={deleting !== null || blocked !== null}
                      title={blocked ?? "Definitief verwijderen"}
                      onClick={() => void remove(item)}
                    >
                      <i className={`ph ${deleting === item.id ? "ph-spinner" : "ph-trash"}`} aria-hidden="true" /> Verwijderen
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
