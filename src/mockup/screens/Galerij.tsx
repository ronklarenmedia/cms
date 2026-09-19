/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function GalerijScreen({ v }: { v: Vals }) {
  const { galleryAlphabet, galleryGroups, galleryMeta, galleryNewLabel, galleryTitle, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "220px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              {galleryTitle}
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              {galleryMeta}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div className="field" style={{ width: "220px" }}>
              <input className="input" type="search" placeholder="Zoek op naam of klant" />
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-funnel"></i>
              Filter
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-plus"></i>
              {galleryNewLabel}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
          {galleryAlphabet.map((a, __i2) => (
            <Fragment key={__i2}>
              <a className="hv2" href={a.href} style={{ width: "24px", height: "24px", display: "grid", placeItems: "center", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "11.5px", textDecoration: "none", color: a.color, background: a.bg }}>
                {a.letter}
              </a>
            </Fragment>
          ))}
        </div>
        {galleryGroups.map((g, __i1) => (
          <Fragment key={__i1}>
            <div id={`g-${g.letter}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", scrollMarginTop: "var(--space-6)", marginBottom: "var(--space-8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "20px", color: "var(--color-accent)", lineHeight: "1" }}>
                  {g.letter}
                </span>
                <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)", whiteSpace: "nowrap" }}>
                  {g.count}
                </span>
                <span style={{ flex: "1", height: "1px", background: "linear-gradient(to right, var(--color-divider), transparent)" }}></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "var(--space-4)" }}>
                {g.items.map((s, __i4) => (
                  <Fragment key={__i4}>
                    <div className="hv4" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", cursor: "pointer" }}>
                      <div style={{ aspectRatio: "16/10", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 8px", borderBottom: "1px solid var(--color-divider)", flex: "none" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-neutral-700)" }}></span>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-neutral-800)" }}></span>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-neutral-800)" }}></span>
                          <span style={{ marginLeft: "6px", flex: "1", minWidth: "0", fontSize: "9.5px", color: "color-mix(in srgb, var(--color-text) 62%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.name}
                          </span>
                        </div>
                        <div style={{ flex: "1", display: "grid", placeItems: "center", background: "linear-gradient(160deg, var(--color-neutral-900), var(--color-bg))", color: "color-mix(in srgb, var(--color-text) 55%, transparent)", gap: "4px" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                            <i className="ph ph-image" style={{ fontSize: "20px" }}></i>
                            <span style={{ fontSize: "9.5px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              Screenshot
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", minWidth: "0" }}>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px", whiteSpace: "normal", textWrap: "pretty", overflowWrap: "anywhere" }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.client}
                          </div>
                        </div>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10.5px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)", flex: "none", paddingTop: "2px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.stateColor }}></span>
                          {s.state}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}
