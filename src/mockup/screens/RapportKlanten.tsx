/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function RapportKlantenScreen({ v }: { v: Vals }) {
  const { pageMax, repChanges, repClient, repCosts, repKpis, repLeads, repList, repPages, repSources } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Klantrapporten
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Augustus 2026 · 3 verstuurd, 2 concept, 2 gepland
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <div className="seg" style={{ alignSelf: "flex-start", width: "max-content", maxWidth: "100%" }}>
              <label className="seg-opt">
                <input type="radio" name="maand" />
                <span>
                  Juni
                </span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="maand" />
                <span>
                  Juli
                </span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="maand" defaultChecked />
                <span>
                  Augustus
                </span>
              </label>
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-file-pdf"></i>
              PDF
            </button>
            <button className="btn btn-secondary">
              <i className="ph ph-link"></i>
              Deelbare link
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-paper-plane-tilt"></i>
              Versturen
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 240px", minWidth: "0", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Klanten
              </h6>
              <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                automatisch de 1e
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {repList.map((r, __i4) => (
                <Fragment key={__i4}>
                  <button onClick={r.select} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", width: "100%", border: "0", cursor: "pointer", textAlign: "left", padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)", background: r.bg, boxShadow: r.ring }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", flex: "none", background: r.color }}></span>
                    <span style={{ flex: "1", minWidth: "0" }}>
                      <span style={{ display: "block", fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13px", color: "var(--color-text)" }}>
                        {r.name}
                      </span>
                      <span style={{ display: "block", fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                        {r.state} · {r.note}
                      </span>
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 460px", minWidth: "0", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-6)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-divider)" }}>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "19px" }}>
                    {repClient}
                  </div>
                  <div style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    Maandrapport augustus 2026 · Ron Klaren Media
                  </div>
                </div>
                <img src="/logo.png" alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", flex: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--space-4)" }}>
                {repKpis.map((k, __i5) => (
                  <Fragment key={__i5}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                        {k.label}
                      </span>
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "25px", lineHeight: "1.1" }}>
                        {k.val}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "var(--color-accent-300)" }}>
                        {k.delta}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Bezoekers per week
                </h6>
                <svg viewBox="0 0 600 110" preserveAspectRatio="none" style={{ width: "100%", height: "120px", display: "block" }}>
                  <defs>
                    <linearGradient id="repFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7d5fd6" stopOpacity="0.24"></stop>
                      <stop offset="100%" stopColor="#7d5fd6" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0 84 C50 80 90 64 150 60 C210 56 240 70 300 58 C360 46 390 34 450 32 C510 30 550 22 600 18 L600 110 L0 110 Z" fill="url(#repFill)"></path>
                  <path d="M0 84 C50 80 90 64 150 60 C210 56 240 70 300 58 C360 46 390 34 450 32 C510 30 550 22 600 18" fill="none" stroke="#7d5fd6" strokeWidth="1.75"></path>
                  <path d="M0 92 C50 90 90 86 150 84 C210 82 240 88 300 82 C360 76 390 70 450 68 C510 66 550 62 600 58" fill="none" stroke="#b2b6ca" strokeWidth="1.25" strokeDasharray="3 4"></path>
                </svg>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
                  <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    Best bekeken pagina's
                  </h6>
                  {repPages.map((p, __i6) => (
                    <Fragment key={__i6}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                        <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                          <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.label}
                          </span>
                          <span style={{ color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
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
                    Bron van bezoek
                  </h6>
                  {repSources.map((s, __i6) => (
                    <Fragment key={__i6}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                        <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                          <span style={{ flex: "1", minWidth: "0" }}>
                            {s.label}
                          </span>
                          <span style={{ color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                            {s.val}
                          </span>
                        </div>
                        <div style={{ height: "3px", borderRadius: "2px", background: "var(--color-neutral-800)" }}>
                          <div style={{ height: "100%", borderRadius: "2px", background: "var(--color-accent-500)", width: s.w }}></div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
                  <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    Gepubliceerd deze maand
                  </h6>
                  {repChanges.map((c, __i6) => (
                    <Fragment key={__i6}>
                      <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px", minWidth: "0" }}>
                        <span style={{ flex: "1", minWidth: "0" }}>
                          {c.label}
                        </span>
                        <span style={{ color: "color-mix(in srgb, var(--color-text) 72%, transparent)", whiteSpace: "nowrap" }}>
                          {c.when}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
                  <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    Leads &amp; inzendingen
                  </h6>
                  {repLeads.map((l, __i6) => (
                    <Fragment key={__i6}>
                      <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px", minWidth: "0" }}>
                        <span style={{ flex: "1", minWidth: "0" }}>
                          {l.label}
                        </span>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                          {l.val}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
                  <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    AI-gebruik
                  </h6>
                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                    <span style={{ flex: "1" }}>
                      Generaties
                    </span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      168
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px" }}>
                    <span style={{ flex: "1" }}>
                      Credits gebruikt
                    </span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      1.960 / 1.500
                    </span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "2px", background: "var(--color-neutral-800)" }}>
                    <div style={{ height: "100%", width: "100%", borderRadius: "2px", background: "#c4881c" }}></div>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
                    460 credits boven de bundel · doorbelast
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "0" }}>
                  <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                    Afgenomen diensten &amp; kosten
                  </h6>
                  {repCosts.map((c, __i6) => (
                    <Fragment key={__i6}>
                      <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "12.5px", minWidth: "0" }}>
                        <span style={{ flex: "1", minWidth: "0" }}>
                          {c.label}
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          {c.val}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "13px", paddingTop: "var(--space-2)", borderTop: "1px solid var(--color-divider)" }}>
                    <span style={{ flex: "1", fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      Totaal augustus
                    </span>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500" }}>
                      € 468,40
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "color-mix(in srgb, var(--color-accent) 8%, transparent)" }}>
                <h6 style={{ margin: "0", color: "var(--color-accent-200)" }}>
                  Advies voor september
                </h6>
                <div className="field">
                  <textarea className="input" style={{ minHeight: "84px", background: "var(--color-surface)" }} defaultValue="De vacaturepagina trekt sneller bezoek dan verwacht; uitbreiden met een teamvideo is de logische volgende stap. Daarnaast raden we aan de AI-bundel te verhogen naar Agency-niveau — dat is voordeliger dan de huidige nabelasting." />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap", fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)" }}>
              <span>
                <i className="ph ph-clock" style={{ marginRight: "5px" }}></i>
                Automatisch versturen op 1 oktober 09:00
              </span>
              <span>
                <i className="ph ph-palette" style={{ marginRight: "5px" }}></i>
                Witlabel met kit van de klant
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
