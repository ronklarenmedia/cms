"use client";

import { createContext, useContext, useState } from "react";
import { uploadImage } from "./upload";

/** De website waarvoor uploads bedoeld zijn. Zonder waarde (bijv. in de componentwerkbank) is er geen uploadknop. */
export const UploadSiteContext = createContext<string | null>(null);

// Grote foto's verkleinen we eerst in de browser: de server accepteert maximaal 5 MB, en hosting kent vaak een lagere
// limiet op verzoeken. De server maakt daarna de definitieve formaten.
const SHRINK_ABOVE_BYTES = 3 * 1024 * 1024;
const MAX_EDGE = 2400;

async function shrinkForUpload(file: File): Promise<File> {
  if (file.size <= SHRINK_ABOVE_BYTES) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file; // bijv. een formaat dat de browser niet kan lezen: de server beoordeelt het dan zelf
  }
}

/** Voorbeeld en uploadknop boven de velden van een afbeelding (`url`, `alt`, …). */
export function ImageUpload({ value, onChange }: { value: unknown; onChange: (next: Record<string, unknown>) => void }) {
  const siteId = useContext(UploadSiteContext);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  if (!siteId) return null;

  const image = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const url = typeof image.url === "string" ? image.url : "";
  const srcset = typeof image.srcset === "string" ? image.srcset : undefined;

  async function pick(file: File) {
    setBusy(true);
    setProblem(null);
    setNotice(null);
    try {
      const body = new FormData();
      const prepared = await shrinkForUpload(file);
      body.set("file", prepared, prepared.name);
      const res = await uploadImage(siteId!, body);
      if (!res.ok) {
        setProblem(res.error);
        return;
      }
      const { url, width, height, srcset } = res.image;
      onChange({ ...image, url, width, height, srcset });
      // De alt-tekst hoort bij het vorige beeld; die blijft staan tot de redacteur hem aanpast.
      if (typeof image.alt === "string" && image.alt.trim() !== "") setNotice("Controleer de alt-tekst: beschrijf wat er op de nieuwe afbeelding te zien is.");
    } catch {
      setProblem("Uploaden is mislukt. Controleer je verbinding en probeer het opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} srcSet={srcset} sizes={srcset ? "320px" : undefined} alt="" className="h-24 w-full rounded-sm border border-divider bg-neutral-900 object-contain" />
      ) : null}
      <label className={`btn btn-secondary ${busy ? "pointer-events-none opacity-60" : ""}`} style={{ fontSize: 11.5 }}>
        <i className={`ph ${busy ? "ph-spinner" : "ph-upload-simple"}`} aria-hidden="true" />
        {busy ? "Bezig met uploaden…" : url ? "Andere afbeelding uploaden" : "Afbeelding uploaden"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = ""; // dezelfde keuze moet opnieuw kunnen
            if (file) void pick(file);
          }}
        />
      </label>
      <span role="status" className={`text-[10.5px] ${problem ? "text-danger" : "text-text/70"}`}>
        {problem ?? notice}
      </span>
    </div>
  );
}
