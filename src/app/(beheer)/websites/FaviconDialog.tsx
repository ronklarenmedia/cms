"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SiteTheme } from "@/blocks/theme";
import { fallbackFaviconDataUri, faviconUrl } from "@/lib/favicon";
import { useConfirm } from "../ConfirmDialog";
import { removeFavicon, uploadFavicon } from "./favicon";

/** Het favicon van een website: een eigen icoon uploaden of het automatische icoon (merkkleur en beginletter) laten staan. */
export function FaviconDialog({
  siteId,
  siteName,
  theme,
  current,
  onClose,
  onChanged,
}: {
  siteId: string;
  siteName: string;
  /** Het thema van de site (na de design kit): het automatische icoon gebruikt de primaire kleur. */
  theme: SiteTheme;
  current: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [url, setUrl] = useState<string | null>(current);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();
  const fileInput = useRef<HTMLInputElement>(null);

  const preview32 = url ? faviconUrl(url, 32) : fallbackFaviconDataUri(siteName, theme);
  const preview180 = url ? faviconUrl(url, 180) : fallbackFaviconDataUri(siteName, theme);

  async function upload(file: File) {
    setBusy(true);
    setProblem(null);
    setDone(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await uploadFavicon(siteId, body);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      setUrl(res.url);
      setDone("Opgeslagen. Het staat online na het volgende publiceren.");
      onChanged();
    } catch {
      setProblem("Uploaden is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function remove() {
    if (!(await confirm("Het eigen favicon weghalen? De website krijgt dan weer het automatische icoon in zijn merkkleur.", { title: "Favicon weghalen", confirmLabel: "Weghalen", danger: true }))) return;
    setBusy(true);
    setProblem(null);
    setDone(null);
    try {
      const res = await removeFavicon(siteId);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      setUrl(null);
      setDone("Weggehaald. Het staat online na het volgende publiceren.");
      onChanged();
    } catch {
      setProblem("Weghalen is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label="Favicon">
          <div className="flex max-h-[80vh] w-full max-w-[520px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center">
              <h4 className="!mb-0 flex-1">Favicon</h4>
              <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten" autoFocus>
                <i className="ph ph-x" />
              </button>
            </div>
            <p className="text-muted m-0 text-[12.5px]">
              Het kleine icoon in het tabblad van de browser en op het beginscherm van een telefoon. Zonder eigen icoon krijgt de website automatisch een icoon in zijn
              merkkleur met de beginletter. Een wijziging staat pas online na het volgende publiceren.
            </p>

            <div className="flex items-center gap-5 rounded-md border border-divider p-4">
              <div className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- een klein icoon van een ander domein (R2) of een data-URI: geen optimalisatie nodig */}
                <img src={preview180} alt="" width={64} height={64} className="size-16 rounded-md" />
                <span className="text-muted text-[10.5px]">Beginscherm</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- zie hierboven */}
                <img src={preview32} alt="" width={32} height={32} className="size-8" />
                <span className="text-muted text-[10.5px]">Tabblad</span>
              </div>
              <div className="min-w-0 flex-1 text-[12.5px]">
                <div className="font-medium">{url ? "Eigen icoon" : "Automatisch icoon"}</div>
                <div className="text-muted text-[11.5px]">{url ? "Geüpload voor deze website." : "In de merkkleur van de website, met de beginletter van de naam."}</div>
              </div>
            </div>

            {problem ? (
              <div role="alert" className="rounded-md border border-danger px-3 py-2 text-[12px] text-danger">
                {problem}
              </div>
            ) : null}
            {done ? (
              <div role="status" className="rounded-md border border-success/40 bg-success/8 px-3 py-2 text-[12px] text-success">
                {done}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="hidden"
                id="favicon-file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
              <label htmlFor="favicon-file" className={`btn btn-primary ${busy ? "pointer-events-none opacity-60" : "cursor-pointer"}`} aria-disabled={busy}>
                <i className={`ph ${busy ? "ph-spinner" : "ph-upload-simple"}`} aria-hidden="true" /> {url ? "Ander icoon uploaden" : "Icoon uploaden"}
              </label>
              {url ? (
                <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => void remove()}>
                  <i className="ph ph-trash" aria-hidden="true" /> Weghalen
                </button>
              ) : null}
            </div>
            <p className="text-muted m-0 text-[11.5px]">
              Liefst vierkant en minimaal 180 × 180 pixels, als PNG of JPG. Een niet-vierkant beeld wordt niet bijgesneden maar met een doorzichtige rand aangevuld. SVG
              wordt niet ondersteund. Maximaal 5 MB.
            </p>
          </div>
        </div>,
        document.body,
      )}
      {confirmDialog}
    </>
  );
}
