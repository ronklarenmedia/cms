/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function RapportOmzetScreen({ v }: { v: Vals }) {
  const { finChurn, finCosts, finKpis, finPlans, finRows, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Omzet &amp; marge
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              September 2026 · cijfers uit Moneybird en platformgebruik
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <div className="seg" style={{ alignSelf: "flex-start", width: "max-content", maxWidth: "100%" }}>
              <label className="seg-opt">
                <input type="radio" name="fp" />
                <span>
                  Maand
                </span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="fp" defaultChecked />
                <span>
                  Kwartaal
                </span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="fp" />
                <span>
                  Jaar
                </span>
              </label>
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-export"></i>
              Exporteren
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
          {finKpis.map((k, __i2) => (
            <Fragment key={__i2}>
              <div className="card elev-sm" style={{ gap: "var(--space-1)", padding: "var(--space-4)" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                  {k.label}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "32px", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                  {k.val}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--color-accent-300)" }}>
                  {k.delta}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="card elev-sm" style={{ padding: "var(--space-4)", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "15px" }}>
                MRR-ontwikkeling
              </div>
              <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                12 maanden · terugkerende omzet exclusief eenmalig werk
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-6)", fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              <span>
                <span style={{ display: "inline-block", width: "18px", height: "2px", background: "var(--color-accent)", verticalAlign: "middle", marginRight: "6px" }}></span>
                MRR
              </span>
              <span>
                <span style={{ display: "inline-block", width: "18px", height: "2px", background: "var(--color-neutral-600)", verticalAlign: "middle", marginRight: "6px" }}></span>
                Kosten
              </span>
            </div>
          </div>
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" style={{ width: "100%", height: "132px", display: "block" }}>
            <defs>
              <linearGradient id="finFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7d5fd6" stopOpacity="0.24"></stop>
                <stop offset="100%" stopColor="#7d5fd6" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0 92 L50 88 L100 82 L150 78 L200 70 L250 66 L300 58 L350 54 L400 46 L450 40 L500 32 L550 26 L600 20 L600 120 L0 120 Z" fill="url(#finFill)"></path>
            <path d="M0 92 L50 88 L100 82 L150 78 L200 70 L250 66 L300 58 L350 54 L400 46 L450 40 L500 32 L550 26 L600 20" fill="none" stroke="#7d5fd6" strokeWidth="1.75"></path>
            <path d="M0 106 L50 105 L100 102 L150 101 L200 98 L250 97 L300 94 L350 93 L400 90 L450 88 L500 86 L550 84 L600 82" fill="none" stroke="#b2b6ca" strokeWidth="1.25"></path>
          </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Omzet per plan
            </h6>
            {finPlans.map((p, __i3) => (
              <Fragment key={__i3}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                    <span style={{ flex: "1", minWidth: "0" }}>
                      {p.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      {p.val}
                    </span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "2px", background: "var(--color-neutral-800)" }}>
                    <div style={{ height: "100%", borderRadius: "2px", background: "var(--color-accent)", width: p.w }}></div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Kosten per dienst
            </h6>
            {finCosts.map((c, __i3) => (
              <Fragment key={__i3}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                    <span style={{ flex: "1", minWidth: "0" }}>
                      {c.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      {c.val}
                    </span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "2px", background: "var(--color-neutral-800)" }}>
                    <div style={{ height: "100%", borderRadius: "2px", background: "var(--color-neutral-500)", width: c.w }}></div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Omzet en marge per klant
            </h6>
            <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
              29 klanten · top 8
            </span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>
                  Klant
                </th>
                <th>
                  Plan
                </th>
                <th style={{ textAlign: "right" }}>
                  Omzet
                </th>
                <th style={{ textAlign: "right" }}>
                  Kosten
                </th>
                <th style={{ textAlign: "right" }}>
                  Marge
                </th>
                <th style={{ textAlign: "right" }}>
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {finRows.map((r, __i4) => (
                <Fragment key={__i4}>
                  <tr>
                    <td style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      {r.name}
                    </td>
                    <td>
                      {r.plan}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {r.omzet}
                    </td>
                    <td style={{ textAlign: "right", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                      {r.kosten}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {r.marge}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--color-accent-300)" }}>
                      {r.pct}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
            Verloop
          </h6>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "var(--space-3)" }}>
            {finChurn.map((c, __i3) => (
              <Fragment key={__i3}>
                <div className="card elev-sm" style={{ gap: "var(--space-1)", padding: "var(--space-4)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
                    <span style={{ flex: "1", fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px" }}>
                      {c.label}
                    </span>
                    <span style={{ fontSize: "13px", color: c.color }}>
                      {c.val}
                    </span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    {c.note}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
