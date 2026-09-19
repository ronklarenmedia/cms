/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function ComponentenScreen({ v }: { v: Vals }) {
  const { compGroups, compIndex, compMeta, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "220px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Componenten
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              {compMeta} · gesorteerd op type
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div className="field" style={{ width: "220px" }}>
              <input className="input" type="search" placeholder="Zoek component" />
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-funnel"></i>
              Filter
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-plus"></i>
              Nieuw component
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
          {compIndex.map((t, __i2) => (
            <Fragment key={__i2}>
              <a className="hv2" href={t.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "var(--radius-md)", fontSize: "12px", textDecoration: "none", color: "var(--color-accent-200)", background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}>
                {t.label}
                <span style={{ fontSize: "10.5px", opacity: "0.6" }}>
                  {t.count}
                </span>
              </a>
            </Fragment>
          ))}
        </div>
        {compGroups.map((g, __i1) => (
          <Fragment key={__i1}>
            <div id={`c-${g.id}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", scrollMarginTop: "var(--space-6)", marginBottom: "var(--space-8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <i className={`${g.icon}`} style={{ fontSize: "17px", color: "var(--color-accent)" }}></i>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "17px", lineHeight: "1" }}>
                  {g.label}
                </span>
                <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)", whiteSpace: "nowrap" }}>
                  {g.count}
                </span>
                <span style={{ flex: "1", height: "1px", background: "linear-gradient(to right, var(--color-divider), transparent)" }}></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "var(--space-4)" }}>
                {g.items.map((c, __i4) => (
                  <Fragment key={__i4}>
                    <div className="hv4" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", cursor: "pointer" }}>
                      <div style={{ aspectRatio: "16/10", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", display: "grid", placeItems: "center", backgroundImage: "linear-gradient(160deg, var(--color-neutral-900), var(--color-surface))" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
                          <i className={`${c.icon}`} style={{ fontSize: "22px" }}></i>
                          <span style={{ fontSize: "9.5px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Preview
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", minWidth: "0" }}>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px", whiteSpace: "normal", textWrap: "pretty", overflowWrap: "anywhere" }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                            {c.uses}
                          </div>
                          <div style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)" }}>
                            {c.vars}
                          </div>
                        </div>
                        <span className={`${c.stateTag}`} style={{ flex: "none", fontSize: "10px" }}>
                          {c.state}
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
