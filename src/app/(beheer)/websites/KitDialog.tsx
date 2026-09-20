"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { clearSiteOverrides, getSiteKits, setSiteKit, type SiteKitInfo } from "../design-kits/actions";
import { fontName, KitSwatches } from "../design-kits/KitPreview";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; info: SiteKitInfo };

/** Kiest de design kit van een site. De eigen aanpassingen van de site blijven gelden; een live site krijgt de nieuwe stijl bij de volgende publicatie. */
export function KitDialog({ siteId, onClose, onChanged }: { siteId: string; onClose: () => void; onChanged: () => void }) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [problem, setProblem] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    getSiteKits(siteId)
      .then((res) => {
        if (!stale) setLoad(res.ok ? { status: "ready", info: res.info } : { status: "error", message: res.error });
      })
      .catch(() => {
        if (!stale) setLoad({ status: "error", message: "De design kits konden niet worden geladen." });
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

  async function choose(kitId: string | null) {
    setWorking(kitId ?? "geen");
    setProblem(null);
    try {
      const res = await setSiteKit(siteId, kitId);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      setLoad((prev) => (prev.status === "ready" ? { status: "ready", info: { ...prev.info, current: kitId } } : prev));
      onChanged();
    } catch {
      setProblem("Opslaan is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setWorking(null);
    }
  }

  async function clearOverrides() {
    if (!window.confirm("De eigen thema-aanpassingen van deze website wissen? Alleen de design kit (en de standaardwaarden) bepalen dan nog de stijl.")) return;
    setWorking("wissen");
    setProblem(null);
    try {
      const res = await clearSiteOverrides(siteId);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      setLoad((prev) => (prev.status === "ready" ? { status: "ready", info: { ...prev.info, overrides: 0 } } : prev));
      onChanged();
    } catch {
      setProblem("Wissen is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setWorking(null);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label="Design kit">
      <div className="flex max-h-[80vh] w-full max-w-[560px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center">
          <h4 className="!mb-0 flex-1">Design kit</h4>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten" autoFocus>
            <i className="ph ph-x" />
          </button>
        </div>
        <p className="text-muted m-0 text-[12.5px]">
          De kit bepaalt kleuren, lettertypes en vormen van deze website. Een kit aanpassen werkt door in alle websites die hem gebruiken; een live website krijgt de nieuwe stijl bij zijn volgende publicatie.
        </p>

        {problem ? (
          <div role="alert" className="rounded-md border border-danger px-3 py-2 text-[12px] text-danger">
            {problem}
          </div>
        ) : null}
        {load.status === "loading" ? <p className="text-muted m-0 text-[13px]">Laden…</p> : null}
        {load.status === "error" ? <p className="m-0 text-[13px] text-danger">{load.message}</p> : null}

        {load.status === "ready" && load.info.overrides > 0 ? (
          <div className="flex flex-col gap-2 rounded-md border border-warning/50 bg-warning/8 px-3 py-2.5 text-[12.5px]">
            <span>
              Deze website heeft nog {load.info.overrides} eigen {load.info.overrides === 1 ? "thema-aanpassing" : "thema-aanpassingen"} uit de tijd vóór design kits. Die gaan boven de kit, dus een andere kit kiezen verandert die tokens niet.
            </span>
            <button type="button" className="btn btn-secondary self-start" style={{ fontSize: 11.5 }} disabled={working !== null} onClick={() => void clearOverrides()}>
              Eigen aanpassingen wissen
            </button>
          </div>
        ) : null}

        {load.status === "ready" ? (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            <li>
              <button
                type="button"
                disabled={working !== null || load.info.current === null}
                onClick={() => void choose(null)}
                className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left ${load.info.current === null ? "border-accent bg-accent/8" : "border-divider hover:bg-text/4"}`}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[13px] font-medium">Geen kit</span>
                  <span className="text-muted text-[11.5px]">Alleen het standaardthema en de eigen aanpassingen van de site</span>
                </span>
                {load.info.current === null ? <span className="tag tag-accent">Gekozen</span> : null}
              </button>
            </li>
            {load.info.kits.map((k) => {
              const current = load.info.current === k.id;
              return (
                <li key={k.id} className="flex items-stretch gap-2">
                  <button
                    type="button"
                    disabled={working !== null || current}
                    onClick={() => void choose(k.id)}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-md border px-3 py-2.5 text-left ${current ? "border-accent bg-accent/8" : "border-divider hover:bg-text/4"}`}
                  >
                    <KitSwatches theme={k.theme} size="sm" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] font-medium">{k.name}</span>
                      <span className="text-muted truncate text-[11.5px]">
                        {k.scope === "platform" ? "Platformkit" : "Kit van de klant"} · {fontName(k.theme)}
                      </span>
                    </span>
                    {current ? <span className="tag tag-accent">Gekozen</span> : working === k.id ? <i className="ph ph-spinner" aria-hidden="true" /> : null}
                  </button>
                  <Link href={`/design-kits/${k.id}`} className="btn btn-secondary btn-icon" title={`${k.name} bewerken`} target="_blank" rel="noreferrer">
                    <i className="ph ph-pencil-simple" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-divider pt-3">
          <Link href="/design-kits/nieuw" className="text-[12.5px] text-text/70 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
            Nieuwe kit maken
          </Link>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Klaar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
