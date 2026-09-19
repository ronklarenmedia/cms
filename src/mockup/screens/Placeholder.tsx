/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function PlaceholderScreen({ v }: { v: Vals }) {
  const { pageTitle } = v;
  return (
    <>
      <div style={{ display: "grid", placeItems: "center", height: "100%", minHeight: "280px", border: "1px dashed var(--color-neutral-800)", borderRadius: "var(--radius-lg)", color: "color-mix(in srgb, var(--color-text) 62%, transparent)", textAlign: "center", padding: "var(--space-8)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
          <i className="ph ph-frame-corners" style={{ fontSize: "26px" }}></i>
          <div style={{ fontSize: "13px" }}>
            Contentgebied —{" "}
            <span style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              {pageTitle}
            </span>
          </div>
          <div style={{ fontSize: "11px", maxWidth: "320px" }}>
            Hier komt het scherm dat je als volgende beschrijft.
          </div>
        </div>
      </div>
    </>
  );
}
