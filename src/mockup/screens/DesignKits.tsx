/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function DesignKitsScreen({ v }: { v: Vals }) {
  const { kitGroups, kitIndex, kitMeta, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "220px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Design kits
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              {kitMeta}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div className="field" style={{ width: "220px" }}>
              <input className="input" type="search" placeholder="Zoek kit of klant" />
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-funnel"></i>
              Filter
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-plus"></i>
              Nieuwe kit
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
          {kitIndex.map((t, __i2) => (
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
        {kitGroups.map((g, __i1) => (
          <Fragment key={__i1}>
            <div id={`dk-${g.id}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", scrollMarginTop: "var(--space-6)", marginBottom: "var(--space-8)" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "var(--space-4)" }}>
                {g.items.map((k, __i4) => (
                  <Fragment key={__i4}>
                    <div className="hv3" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", cursor: "pointer" }}>
                      <div style={{ aspectRatio: "16/10", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", background: k.paper }}>
                        <div style={{ flex: "1", padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", minWidth: "0" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "22px", lineHeight: "1", letterSpacing: "-0.02em", color: k.ink }}>
                            Aa
                          </div>
                          <div style={{ height: "4px", width: "70%", borderRadius: "2px", background: k.accent }}></div>
                          <div style={{ height: "3px", width: "52%", borderRadius: "2px", background: k.tint }}></div>
                          <div style={{ height: "3px", width: "38%", borderRadius: "2px", background: k.tint }}></div>
                        </div>
                        <div style={{ display: "flex", height: "16px", flex: "none" }}>
                          {k.swatches.map((s, __i8) => (
                            <Fragment key={__i8}>
                              <span style={{ flex: "1", background: s.c }}></span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", minWidth: "0" }}>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px", whiteSpace: "normal", textWrap: "pretty", overflowWrap: "anywhere" }}>
                            {k.name}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {k.client} · {k.uses}
                          </div>
                          <div style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {k.fonts}
                          </div>
                        </div>
                        <span className={`${k.stateTag}`} style={{ flex: "none", fontSize: "10px" }}>
                          {k.state}
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
