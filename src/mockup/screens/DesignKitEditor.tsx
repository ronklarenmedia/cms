/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function DesignKitEditorScreen({ v }: { v: Vals }) {
  const { kAccent, kFontName, kFontStack, kInk, kPaper, kRadius, kRadiusPill, kRadiusSm, kSurface, kTint, kitFontOpts, kitPaperOpts, kitRadius, kitRadiusLabel, kitSetRadius, kitSwatches, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Design kit bewerken
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Meridian Corporate · laatst gewijzigd 3 dagen geleden · in 12 sites
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <button className="btn btn-secondary">
              <i className="ph ph-arrow-counter-clockwise"></i>
              Versies
            </button>
            <button className="btn btn-secondary">
              Annuleren
            </button>
            <button className="btn btn-primary">
              <i className="ph ph-check"></i>
              Kit opslaan
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-8)", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", flex: "1 1 420px", minWidth: "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Basis
              </h6>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "var(--space-3)" }}>
                <div className="field">
                  <label>
                    Naam kit
                  </label>
                  <input className="input" placeholder="Meridian Corporate" />
                </div>
                <div className="field">
                  <label>
                    Klant
                  </label>
                  <input className="input" placeholder="Meridian Studio" />
                </div>
                <div className="field">
                  <label>
                    Stijlrichting
                  </label>
                  <input className="input" placeholder="Corporate" />
                </div>
                <div className="field">
                  <label>
                    Status
                  </label>
                  <input className="input" placeholder="Actief" />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Kleur
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  Accent
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                  {kitSwatches.map((s, __i6) => (
                    <Fragment key={__i6}>
                      <button onClick={s.select} title={s.name} style={{ width: "30px", height: "30px", border: "0", padding: "0", cursor: "pointer", borderRadius: "50%", background: s.c, boxShadow: s.ring }}></button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  Papier
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                  {kitPaperOpts.map((s, __i6) => (
                    <Fragment key={__i6}>
                      <button onClick={s.select} title={s.name} style={{ width: "30px", height: "30px", border: "0", padding: "0", cursor: "pointer", borderRadius: "50%", background: s.c, boxShadow: s.ring }}></button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--space-3)" }}>
                <div className="field">
                  <label>
                    Inkt
                  </label>
                  <input className="input" value={kInk}  readOnly />
                </div>
                <div className="field">
                  <label>
                    Accent
                  </label>
                  <input className="input" value={kAccent}  readOnly />
                </div>
                <div className="field">
                  <label>
                    Tint
                  </label>
                  <input className="input" value={kTint}  readOnly />
                </div>
                <div className="field">
                  <label>
                    Papier
                  </label>
                  <input className="input" value={kPaper}  readOnly />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Typografie
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  Koplettertype
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "var(--space-2)" }}>
                  {kitFontOpts.map((f, __i6) => (
                    <Fragment key={__i6}>
                      <button onClick={f.select} style={{ display: "flex", alignItems: "baseline", gap: "8px", padding: "var(--space-3)", border: "0", borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left", background: f.bg, boxShadow: f.ring, color: f.fg }}>
                        <span style={{ fontSize: "19px", lineHeight: "1", fontFamily: f.stack }}>
                          Aa
                        </span>
                        <span style={{ fontSize: "12px", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.name}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "var(--space-3)" }}>
                <div className="field">
                  <label>
                    Broodtekst
                  </label>
                  <input className="input" defaultValue="Inter" />
                </div>
                <div className="field">
                  <label>
                    Basisgrootte
                  </label>
                  <input className="input" defaultValue="16 px" />
                </div>
                <div className="field">
                  <label>
                    Type-schaal
                  </label>
                  <input className="input" defaultValue="1.25 (major third)" />
                </div>
                <div className="field">
                  <label>
                    Regelhoogte
                  </label>
                  <input className="input" defaultValue="1.55" />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Vorm &amp; ritme
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  <span>
                    Hoekradius
                  </span>
                  <span>
                    {kitRadiusLabel}
                  </span>
                </div>
                <input type="range" min="0" max="24" step="1" value={kitRadius} onChange={kitSetRadius} onChange={kitSetRadius} style={{ width: "100%", maxWidth: "320px", accentColor: "var(--color-accent)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "var(--space-3)" }}>
                <div className="field">
                  <label>
                    Spacing-dichtheid
                  </label>
                  <input className="input" defaultValue="Ruim (1.0×)" />
                </div>
                <div className="field">
                  <label>
                    Knopstijl
                  </label>
                  <input className="input" defaultValue="Gevuld" />
                </div>
                <div className="field">
                  <label>
                    Schaduw
                  </label>
                  <input className="input" defaultValue="Zacht" />
                </div>
                <div className="field">
                  <label>
                    Rasterbreedte
                  </label>
                  <input className="input" defaultValue="1200 px · 12 koloms" />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", position: "sticky", top: "0", flex: "1 1 320px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Live voorbeeld
              </h6>
              <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
                {kFontName} · {kitRadiusLabel}
              </span>
            </div>
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-md)", background: kPaper }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: kSurface }}>
                <span style={{ width: "18px", height: "18px", borderRadius: kRadiusSm, background: kAccent, flex: "none" }}></span>
                <span style={{ fontFamily: kFontStack, fontSize: "13px", color: kInk, flex: "1" }}>
                  Meridian
                </span>
                <span style={{ fontSize: "10.5px", color: kInk, opacity: "0.6" }}>
                  Diensten
                </span>
                <span style={{ fontSize: "10.5px", color: kInk, opacity: "0.6" }}>
                  Cases
                </span>
                <span style={{ fontSize: "10px", color: kPaper, background: kAccent, padding: "4px 10px", borderRadius: kRadiusPill }}>
                  Contact
                </span>
              </div>
              <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontFamily: kFontStack, fontSize: "24px", lineHeight: "1.15", letterSpacing: "-0.02em", color: kInk }}>
                  Merkwerk dat blijft staan
                </div>
                <div style={{ fontSize: "12px", lineHeight: "1.55", color: kInk, opacity: "0.72", maxWidth: "34ch" }}>
                  Deze kit bepaalt kleur, type en vorm voor elke site en app die de klant afneemt.
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11.5px", color: kPaper, background: kAccent, padding: "7px 14px", borderRadius: kRadius }}>
                    Plan een gesprek
                  </span>
                  <span style={{ fontSize: "11.5px", color: kInk, background: kTint, padding: "7px 14px", borderRadius: kRadius }}>
                    Bekijk werk
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                  <div style={{ padding: "12px", borderRadius: kRadius, background: kSurface, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: kRadiusSm, background: kAccent }}></span>
                    <span style={{ fontFamily: kFontStack, fontSize: "12px", color: kInk }}>
                      Strategie
                    </span>
                    <span style={{ height: "3px", width: "80%", borderRadius: "2px", background: kTint }}></span>
                    <span style={{ height: "3px", width: "60%", borderRadius: "2px", background: kTint }}></span>
                  </div>
                  <div style={{ padding: "12px", borderRadius: kRadius, background: kSurface, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: kRadiusSm, background: kAccent }}></span>
                    <span style={{ fontFamily: kFontStack, fontSize: "12px", color: kInk }}>
                      Realisatie
                    </span>
                    <span style={{ height: "3px", width: "70%", borderRadius: "2px", background: kTint }}></span>
                    <span style={{ height: "3px", width: "50%", borderRadius: "2px", background: kTint }}></span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", height: "18px" }}>
                <span style={{ flex: "1", background: kInk }}></span>
                <span style={{ flex: "1", background: kAccent }}></span>
                <span style={{ flex: "1", background: kTint }}></span>
                <span style={{ flex: "1", background: kSurface }}></span>
              </div>
            </div>
            <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 70%, transparent)", lineHeight: "1.5" }}>
              Wijzigingen gelden na opslaan voor 12 sites en 3 apps. Bestaande publicaties blijven op de huidige versie tot ze opnieuw gepubliceerd worden.
            </div>
            <button className="btn btn-secondary btn-block">
              <i className="ph ph-arrows-clockwise"></i>
              Opslaan &amp; sites bijwerken
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
