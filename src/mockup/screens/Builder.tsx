/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function BuilderScreen({ v }: { v: Vals }) {
  const { bAddTitle, bBack, bCanvasWidth, bDevices, bNavTitle, bPages, bSectionMeta, bSections, bSelPage, bShowBack, bTrackShift } = v;
  return (
    <>
      <div style={{ display: "flex", height: "100%", minHeight: "0", gap: "1px", background: "var(--color-divider)" }}>
        <div style={{ flex: "1 1 10%", minWidth: "124px", display: "flex", flexDirection: "column", minHeight: "0", background: "var(--color-bg)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "var(--space-3) var(--space-3) var(--space-2)", minHeight: "36px" }}>
            {bShowBack ? (
              <>
                <button className="btn btn-ghost" onClick={bBack} title="Terug naar pagina's" style={{ width: "20px", height: "20px", padding: "0", flex: "none", fontSize: "12px", color: "var(--color-accent-200)" }}>
                  <i className="ph ph-caret-left"></i>
                </button>
              </>
            ) : null}
            <span style={{ flex: "1", minWidth: "0", fontFamily: "var(--font-heading)", fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 62%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {bNavTitle}
            </span>
            <button className="btn btn-ghost" title={bAddTitle} style={{ width: "20px", height: "20px", padding: "0", flex: "none", fontSize: "12px", color: "var(--color-accent-200)" }}>
              <i className="ph ph-plus"></i>
            </button>
          </div>
          <div style={{ flex: "1", minHeight: "0", overflow: "hidden" }}>
            <div style={{ display: "flex", width: "200%", height: "100%", transform: `translateX(${bTrackShift})`, transition: "transform 260ms cubic-bezier(0.4,0,0.2,1)" }}>
              <div style={{ flex: "0 0 50%", minWidth: "0", height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "1px", padding: "0 var(--space-2) var(--space-3)" }}>
                {bPages.map((p, __i5) => (
                  <Fragment key={__i5}>
                    <button className="hv1" onClick={p.select} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 8px", border: "0", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "11px", background: p.bg, color: p.fg, boxShadow: p.ring }}>
                      <i className={`${p.icon}`} style={{ fontSize: "13px", flex: "none" }}></i>
                      <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.label}
                      </span>
                      <i className="ph ph-caret-right" style={{ fontSize: "10px", flex: "none", opacity: "0.6" }}></i>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ flex: "0 0 50%", minWidth: "0", height: "100%", overflow: "auto", display: "flex", flexDirection: "column", gap: "1px", padding: "0 var(--space-2) var(--space-3)" }}>
                {bSections.map((s, __i5) => (
                  <Fragment key={__i5}>
                    <button className="hv1" onClick={s.select} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 8px", border: "0", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "11px", background: s.bg, color: s.fg, boxShadow: s.ring }}>
                      <i className={`${s.icon}`} style={{ fontSize: "13px", flex: "none" }}></i>
                      <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.label}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 70%", display: "flex", flexDirection: "column", minWidth: "0", minHeight: "0", background: "var(--color-neutral-900)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4)", borderBottom: "1px solid var(--color-divider)", minHeight: "46px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px", borderRadius: "var(--radius-md)", background: "color-mix(in srgb, var(--color-text) 5%, transparent)" }}>
              {bDevices.map((d, __i4) => (
                <Fragment key={__i4}>
                  <button onClick={d.select} style={{ width: "26px", height: "24px", display: "grid", placeItems: "center", border: "0", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "13px", background: d.bg, color: d.fg }}>
                    <i className={`${d.icon}`}></i>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ flex: "1 1 auto", minWidth: "0", display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 66%, transparent)", overflow: "hidden" }}>
              <i className="ph ph-link-simple" style={{ fontSize: "13px", flex: "none" }}></i>
              <span style={{ minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                meridianstudio.nl/{bSelPage}
              </span>
            </div>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <button className="btn btn-icon btn-secondary" title="Ongedaan maken">
                <i className="ph ph-arrow-counter-clockwise"></i>
              </button>
              <button className="btn btn-icon btn-secondary" title="Opnieuw">
                <i className="ph ph-arrow-clockwise"></i>
              </button>
              <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                <i className="ph ph-eye"></i>
                {" "}Voorbeeld
              </button>
              <button className="btn btn-primary" style={{ fontSize: "12px" }}>
                <i className="ph ph-rocket-launch"></i>
                {" "}Publiceren
              </button>
            </div>
          </div>
          <div style={{ flex: "1", minHeight: "0", overflow: "auto", padding: "var(--space-4)", display: "flex", justifyContent: "center" }}>
            <div style={{ width: bCanvasWidth, maxWidth: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-lg)", alignSelf: "flex-start" }}>
              {bSections.map((s, __i4) => (
                <Fragment key={__i4}>
                  <div onClick={s.select} style={{ position: "relative", height: s.height, background: s.paper, color: s.ink, outline: s.outline, outlineOffset: "-2px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", padding: "0 9%" }}>
                    <div style={{ height: "14px", width: "42%", borderRadius: "3px", background: "currentColor", opacity: "0.72" }}></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ height: "7px", width: "66%", borderRadius: "3px", background: "currentColor", opacity: "0.26" }}></div>
                      <div style={{ height: "7px", width: "54%", borderRadius: "3px", background: "currentColor", opacity: "0.26" }}></div>
                    </div>
                    <div style={{ height: "26px", width: "104px", borderRadius: "var(--radius-sm)", border: "1px solid currentColor", opacity: "0.4" }}></div>
                    {s.badgeShow ? (
                      <>
                        <div style={{ position: "absolute", top: "0", left: "0", padding: "3px 8px", fontFamily: "var(--font-body)", fontSize: "10.5px", letterSpacing: "0.04em", background: "var(--color-accent)", color: "var(--color-neutral-900)" }}>
                          {s.label}
                        </div>
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 20%", minWidth: "170px", display: "flex", flexDirection: "column", minHeight: "0", background: "var(--color-bg)" }}>
          <div style={{ padding: "var(--space-3) var(--space-4) var(--space-2)", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "10.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-text) 62%, transparent)" }}>
              Instellingen
            </span>
            <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {bSectionMeta}
            </span>
          </div>
          <div style={{ flex: "1", minHeight: "0", overflow: "auto", display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-2) var(--space-4) var(--space-6)" }}>
            <label className="field" style={{ gap: "4px" }}>
              <span style={{ fontSize: "11px" }}>
                Variant
              </span>
              <select className="input" style={{ fontSize: "11.5px", padding: "6px 8px" }}>
                <option>
                  Beeld links
                </option>
                <option>
                  Beeld rechts
                </option>
                <option>
                  Volledige breedte
                </option>
                <option>
                  Gecentreerd
                </option>
              </select>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px" }}>
                Achtergrond
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button style={{ width: "22px", height: "22px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-neutral-700)", background: "#f6f4f0", cursor: "pointer" }}></button>
                <button style={{ width: "22px", height: "22px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-neutral-700)", background: "#eceae5", cursor: "pointer" }}></button>
                <button style={{ width: "22px", height: "22px", borderRadius: "var(--radius-sm)", border: "2px solid var(--color-accent)", background: "#23212b", cursor: "pointer" }}></button>
                <button style={{ width: "22px", height: "22px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-neutral-700)", background: "var(--color-accent)", cursor: "pointer" }}></button>
              </div>
            </div>
            <label className="field" style={{ gap: "4px" }}>
              <span style={{ fontSize: "11px" }}>
                Hoogte
              </span>
              <select className="input" defaultValue="Normaal" style={{ fontSize: "11.5px", padding: "6px 8px" }}>
                <option>
                  Compact
                </option>
                <option>
                  Normaal
                </option>
                <option>
                  Volledig scherm
                </option>
              </select>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px" }}>
                Uitlijning
              </span>
              <div className="seg" style={{ fontSize: "11px", display: "flex" }}>
                <button className="seg-opt" style={{ flex: "1 1 0", minWidth: "0", padding: "5px 2px" }}>
                  Links
                </button>
                <button className="seg-opt" aria-pressed="true" style={{ flex: "1 1 0", minWidth: "0", padding: "5px 2px" }}>
                  Midden
                </button>
                <button className="seg-opt" style={{ flex: "1 1 0", minWidth: "0", padding: "5px 2px" }}>
                  Rechts
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px" }}>
                Zichtbaarheid
              </span>
              <label className="radio" style={{ fontSize: "11px", gap: "6px" }}>
                <input type="checkbox" defaultChecked={true} />
                <span className="dot"></span>
                <span>
                  Desktop
                </span>
              </label>
              <label className="radio" style={{ fontSize: "11px", gap: "6px" }}>
                <input type="checkbox" defaultChecked={true} />
                <span className="dot"></span>
                <span>
                  Tablet
                </span>
              </label>
              <label className="radio" style={{ fontSize: "11px", gap: "6px" }}>
                <input type="checkbox" />
                <span className="dot"></span>
                <span>
                  Mobiel
                </span>
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-divider)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--color-accent-200)" }}>
                <i className="ph ph-sparkle" style={{ fontSize: "12px" }}></i>
                {" "}AI-aanpassing
              </span>
              <textarea className="input" rows="3" placeholder="Beschrijf de wijziging…" style={{ fontSize: "11.5px", padding: "6px 8px", resize: "vertical" }} />
              <button className="btn btn-primary btn-block" style={{ fontSize: "11.5px" }}>
                Toepassen
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
