"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/** Interne links in de site (`/contact`) blijven binnen het voorbeeld, in plaats van het platform zelf te openen. */
export function PreviewLinks({ siteId, children }: { siteId: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <div
      onClickCapture={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        const href = a?.getAttribute("href");
        if (!a || !href || !href.startsWith("/") || href.startsWith("//")) return;
        e.preventDefault();
        router.push(`/websites/${siteId}/voorbeeld${href}`);
      }}
    >
      {children}
    </div>
  );
}
