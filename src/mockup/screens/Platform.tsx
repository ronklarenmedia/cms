/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function PlatformScreen({ v }: { v: Vals }) {
  const { clients, deploys, kpis, pageMax, pages, services } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--space-8) * 1.3)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Platformoverzicht
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Laatste 30 dagen · bijgewerkt 2 minuten geleden
            </div>
          </div>
          <div className="seg" style={{ alignSelf: "flex-start", width: "max-content", maxWidth: "100%" }}>
            <label className="seg-opt">
              <input type="radio" name="tf" />
              <span>
                24 u
              </span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="tf" />
              <span>
                7 d
              </span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="tf" defaultChecked />
              <span>
                30 d
              </span>
            </label>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Systeemstatus
            </h6>
            <span style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)" }}>
              2 van 6 diensten vragen aandacht
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "var(--space-3)" }}>
            {services.map((s, __i3) => (
              <Fragment key={__i3}>
                <div className="card elev-sm" style={{ gap: "var(--space-2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <i className={`${s.icon}`} style={{ fontSize: "15px", color: "color-mix(in srgb, var(--color-text) 60%, transparent)" }}></i>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px", flex: "1", minWidth: "0" }}>
                      {s.name}
                    </span>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", flex: "none", background: s.dot }}></span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: s.labelColor }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                    {s.note}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
          {kpis.map((k, __i2) => (
            <Fragment key={__i2}>
              <div className="card elev-sm" style={{ gap: "var(--space-1)", padding: "var(--space-4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                  <i className={`${k.icon}`} style={{ fontSize: "14px", color: "var(--color-accent)" }}></i>
                  {k.label}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "34px", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                  {k.value}
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
                Bezoekers over alle tenants
              </div>
              <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                3,9 mln pageviews · piek dinsdag 14:00
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-6)", fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              <span>
                <span style={{ display: "inline-block", width: "18px", height: "2px", background: "var(--color-accent)", verticalAlign: "middle", marginRight: "6px" }}></span>
                Bezoekers
              </span>
              <span>
                <span style={{ display: "inline-block", width: "18px", height: "2px", background: "var(--color-neutral-700)", verticalAlign: "middle", marginRight: "6px" }}></span>
                Vorige periode
              </span>
            </div>
          </div>
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" style={{ width: "100%", height: "132px", display: "block" }}>
            <defs>
              <linearGradient id="nocFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9184d9" stopOpacity="0.28"></stop>
                <stop offset="100%" stopColor="#9184d9" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0 96 C40 92 60 80 90 84 C120 88 140 62 170 58 C200 54 220 70 250 64 C280 58 300 38 330 44 C360 50 380 34 410 30 C440 26 460 46 490 40 C520 34 550 22 600 16 L600 120 L0 120 Z" fill="url(#nocFill)"></path>
            <path d="M0 96 C40 92 60 80 90 84 C120 88 140 62 170 58 C200 54 220 70 250 64 C280 58 300 38 330 44 C360 50 380 34 410 30 C440 26 460 46 490 40 C520 34 550 22 600 16" fill="none" stroke="#9184d9" strokeWidth="1.75"></path>
            <path d="M0 104 C40 100 60 98 90 100 C120 102 140 88 170 86 C200 84 220 92 250 90 C280 88 300 74 330 78 C360 82 380 70 410 68 C440 66 460 76 490 72 C520 68 550 60 600 56" fill="none" stroke="#595d6c" strokeWidth="1.25" strokeDasharray="3 4"></path>
          </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "var(--space-6)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Populaire klanten
              </h6>
              <button className="btn btn-ghost" style={{ fontSize: "12px" }}>
                Alle klanten
              </button>
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
                    Sites
                  </th>
                  <th style={{ textAlign: "right" }}>
                    Bezoek
                  </th>
                  <th style={{ textAlign: "right" }}>
                    Groei
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, __i5) => (
                  <Fragment key={__i5}>
                    <tr>
                      <td style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                        {c.name}
                      </td>
                      <td>
                        <span className={`${c.tag}`}>
                          {c.plan}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {c.sites}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {c.visits}
                      </td>
                      <td style={{ textAlign: "right", color: "var(--color-accent-300)" }}>
                        {c.trend}
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", minWidth: "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Best bekeken pagina's
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {pages.map((p, __i5) => (
                  <Fragment key={__i5}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "0" }}>
                      <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "12.5px" }}>
                        <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.path}
                        </span>
                        <span style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                          {p.views}
                        </span>
                      </div>
                      <div style={{ height: "3px", borderRadius: "2px", background: "var(--color-neutral-900)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "2px", background: "var(--color-accent)", width: p.w }}></div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Recente deploys
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {deploys.map((d, __i5) => (
                  <Fragment key={__i5}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-md)", background: "var(--color-surface)" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", flex: "none", background: d.color }}></span>
                      <span style={{ flex: "1", minWidth: "0", fontSize: "12.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {d.site}
                      </span>
                      <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)", whiteSpace: "nowrap" }}>
                        {d.who}
                      </span>
                      <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 62%, transparent)", whiteSpace: "nowrap" }}>
                        {d.when}
                      </span>
                      <span style={{ fontSize: "11px", color: d.color, whiteSpace: "nowrap" }}>
                        {d.state}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
