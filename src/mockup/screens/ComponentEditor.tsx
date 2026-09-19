/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function ComponentEditorScreen({ v }: { v: Vals }) {
  const { compAccent, compBpOpts, compCanvasWidth, compFontStack, compHeading, compHeadingSize, compInk, compLayerName, compLayers, compMediaDisplay, compPad, compPadLabel, compPadPx, compRowWrap, compSetHeading, compSetPad, compSetSize, compSize, compSizeLabel, compTextAlign, compTextItems, compTint, compToggleBg, compToggleMedia, compToggleX, compVariantOpts, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Split hero
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Component · Hero's · in 131 sites · v4.2 concept
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div style={{ display: "flex", gap: "2px", padding: "2px", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
              {compBpOpts.map((b, __i4) => (
                <Fragment key={__i4}>
                  <button onClick={b.select} title={b.label} style={{ width: "30px", height: "28px", border: "0", padding: "0", cursor: "pointer", borderRadius: "var(--radius-sm)", fontSize: "15px", background: b.bg, color: b.fg }}>
                    <i className={`${b.icon}`}></i>
                  </button>
                </Fragment>
              ))}
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-code"></i>
              Code
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-check"></i>
              Publiceren
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 200px", minWidth: "0", maxWidth: "260px", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Lagen
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", padding: "var(--space-2)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
              {compLayers.map((l, __i4) => (
                <Fragment key={__i4}>
                  <button className="hv1" onClick={l.select} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", width: "100%", border: "0", cursor: "pointer", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "12.5px", textAlign: "left", padding: "5px var(--space-3)", paddingLeft: l.pad, background: l.bg, color: l.fg }}>
                    <i className={`${l.icon}`} style={{ fontSize: "13px", flex: "none" }}></i>
                    <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.label}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Variant
              </h6>
              {compVariantOpts.map((v, __i4) => (
                <Fragment key={__i4}>
                  <button onClick={v.select} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", width: "100%", border: "0", cursor: "pointer", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)", fontSize: "12.5px", textAlign: "left", padding: "var(--space-2) var(--space-3)", background: v.bg, boxShadow: v.ring, color: v.fg }}>
                    {v.label}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Canvas
              </h6>
              <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                Meridian Corporate · {compPadLabel} padding
              </span>
            </div>
            <div style={{ borderRadius: "var(--radius-lg)", padding: "var(--space-4)", background: "repeating-conic-gradient(var(--color-neutral-900) 0% 25%, var(--color-surface) 0% 50%) 50%/16px 16px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: compCanvasWidth, maxWidth: "100%", background: "#ffffff", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
                <div style={{ display: "flex", flexDirection: compRowWrap, gap: "24px", alignItems: "center", padding: `${compPadPx} 32px` }}>
                  <div style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px", textAlign: compTextAlign, alignItems: compTextItems }}>
                    <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: compAccent }}>
                      Strategie &amp; realisatie
                    </span>
                    <div style={{ fontFamily: compFontStack, fontSize: compHeadingSize, lineHeight: "1.1", letterSpacing: "-0.02em", color: compInk, outline: `1px dashed ${compAccent}`, outlineOffset: "6px" }}>
                      {compHeading}
                    </div>
                    <div style={{ fontSize: "13px", lineHeight: "1.6", color: compInk, opacity: "0.72", maxWidth: "42ch" }}>
                      Eén component, elke klant een eigen kit. Tekst en beeld komen uit de CMS-velden van de site.
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "#ffffff", background: compAccent, padding: "9px 16px", borderRadius: "8px" }}>
                        Plan een gesprek
                      </span>
                      <span style={{ fontSize: "12px", color: compInk, background: compTint, padding: "9px 16px", borderRadius: "8px" }}>
                        Bekijk werk
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: "1 1 200px", minWidth: "0", width: "100%", aspectRatio: "4/3", borderRadius: "10px", background: compTint, display: compMediaDisplay, placeItems: "center", color: compInk, opacity: "0.75" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <i className="ph ph-image" style={{ fontSize: "22px" }}></i>
                      <span style={{ fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Media slot
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
              <span>
                <i className="ph ph-cursor-click" style={{ marginRight: "5px" }}></i>
                Geselecteerd: {compLayerName}
              </span>
              <span>
                <i className="ph ph-warning-circle" style={{ marginRight: "5px" }}></i>
                2 sites overschrijven deze variant
              </span>
            </div>
          </div>
          <div style={{ flex: "1 1 260px", minWidth: "0", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "var(--space-4)", position: "sticky", top: "0" }}>
            <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Eigenschappen · {compLayerName}
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
              <div className="field">
                <label>
                  Tekst
                </label>
                <input className="input" value={compHeading} onChange={compSetHeading} onChange={compSetHeading} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  <span>
                    Tekengrootte
                  </span>
                  <span>
                    {compSizeLabel}
                  </span>
                </div>
                <input type="range" min="24" max="64" step="1" value={compSize} onChange={compSetSize} onChange={compSetSize} style={{ width: "100%", accentColor: "var(--color-accent)" }} />
              </div>
              <div className="field">
                <label>
                  Kleurtoken
                </label>
                <input className="input" defaultValue="kit.ink" />
              </div>
              <div className="field">
                <label>
                  CMS-veld
                </label>
                <input className="input" defaultValue="page.hero.title" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                Sectie
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  <span>
                    Verticale padding
                  </span>
                  <span>
                    {compPadLabel}
                  </span>
                </div>
                <input type="range" min="16" max="120" step="4" value={compPad} onChange={compSetPad} onChange={compSetPad} style={{ width: "100%", accentColor: "var(--color-accent)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <span style={{ fontSize: "12.5px" }}>
                  Media slot tonen
                </span>
                <button onClick={compToggleMedia} style={{ width: "34px", height: "20px", flex: "none", border: "0", padding: "0", cursor: "pointer", borderRadius: "10px", position: "relative", background: compToggleBg }}>
                  <span style={{ position: "absolute", top: "2px", left: compToggleX, width: "16px", height: "16px", borderRadius: "50%", background: "#ffffff", transition: "left .15s ease" }}></span>
                </button>
              </div>
              <div className="field">
                <label>
                  Achtergrond
                </label>
                <input className="input" defaultValue="kit.paper" />
              </div>
            </div>
            <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)", lineHeight: "1.5" }}>
              Publiceren zet v4.2 klaar voor alle sites die dit component gebruiken; klanten met een eigen override behouden hun versie.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
