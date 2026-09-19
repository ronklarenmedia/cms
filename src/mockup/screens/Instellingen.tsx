/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import { Fragment } from "react";
import type { Vals } from "../logic";

export function InstellingenScreen({ v }: { v: Vals }) {
  const { kitSwatches, pageMax, setServices, setStubItems, setStubShow, setStubTitle, setTabAI, setTabAlgemeen, setTabKoppelingen, setTabThema, setTabs } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Instellingen
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              Platformbreed · geldt voor alle klanten tenzij per werkruimte overschreven
            </div>
          </div>
          <button className="btn btn-primary">
            <i className="ph ph-check"></i>
            Wijzigingen opslaan
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
          {setTabs.map((t, __i2) => (
            <Fragment key={__i2}>
              <button className="hv1" onClick={t.select} style={{ border: "0", cursor: "pointer", padding: "5px 11px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-body)", fontSize: "12.5px", whiteSpace: "nowrap", background: t.bg, color: t.fg, boxShadow: t.ring }}>
                {t.label}
              </button>
            </Fragment>
          ))}
        </div>
        {setTabAlgemeen ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Organisatie
                </h6>
                <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ width: "72px", height: "72px", flex: "none", borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
                    <img src="/logo.png" alt="Logo" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                  </div>
                  <div style={{ flex: "1 1 240px", minWidth: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "var(--space-3)" }}>
                    <div className="field">
                      <label>
                        Naam platform
                      </label>
                      <input className="input" defaultValue="Ron Klaren Media" />
                    </div>
                    <div className="field">
                      <label>
                        Beheerdomein
                      </label>
                      <input className="input" defaultValue="beheer.ronklaren.app" />
                    </div>
                    <div className="field">
                      <label>
                        Taal
                      </label>
                      <input className="input" defaultValue="Nederlands" />
                    </div>
                    <div className="field">
                      <label>
                        Tijdzone
                      </label>
                      <input className="input" defaultValue="Europe/Amsterdam" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Contact &amp; afzender
                </h6>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
                  <div className="field">
                    <label>
                      Supportadres
                    </label>
                    <input className="input" defaultValue="support@ronklaren.nl" />
                  </div>
                  <div className="field">
                    <label>
                      Afzendernaam e-mail
                    </label>
                    <input className="input" defaultValue="Ron Klaren Media" />
                  </div>
                  <div className="field">
                    <label>
                      Telefoon
                    </label>
                    <input className="input" defaultValue="+31 6 1234 5678" />
                  </div>
                  <div className="field">
                    <label>
                      KvK
                    </label>
                    <input className="input" defaultValue="12345678" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {setTabThema ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Weergave van dit platform
                </h6>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    Modus
                  </span>
                  <div className="seg" style={{ alignSelf: "flex-start", width: "max-content", maxWidth: "100%" }}>
                    <label className="seg-opt">
                      <input type="radio" name="mode" defaultChecked />
                      <span>
                        Licht
                      </span>
                    </label>
                    <label className="seg-opt">
                      <input type="radio" name="mode" />
                      <span>
                        Donker
                      </span>
                    </label>
                    <label className="seg-opt">
                      <input type="radio" name="mode" />
                      <span>
                        Systeem
                      </span>
                    </label>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    Accentkleur — uit het merklogo
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
                    Interfacedichtheid
                  </span>
                  <div className="seg" style={{ alignSelf: "flex-start", width: "max-content", maxWidth: "100%" }}>
                    <label className="seg-opt">
                      <input type="radio" name="dens" />
                      <span>
                        Compact
                      </span>
                    </label>
                    <label className="seg-opt">
                      <input type="radio" name="dens" defaultChecked />
                      <span>
                        Comfortabel
                      </span>
                    </label>
                    <label className="seg-opt">
                      <input type="radio" name="dens" />
                      <span>
                        Ruim
                      </span>
                    </label>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
                  <div className="field">
                    <label>
                      Lettertype interface
                    </label>
                    <input className="input" defaultValue="Inter" />
                  </div>
                  <div className="field">
                    <label>
                      Startpagina na inloggen
                    </label>
                    <input className="input" defaultValue="Platform" />
                  </div>
                </div>
                <label className="radio" style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                  <input type="checkbox" defaultChecked />
                  <span className="dot"></span>
                  Menu ingeklapt onthouden per gebruiker
                </label>
              </div>
            </div>
          </>
        ) : null}
        {setTabKoppelingen ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Diensten
              </h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {setServices.map((s, __i4) => (
                  <Fragment key={__i4}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", flexWrap: "wrap" }}>
                      <i className={`${s.icon}`} style={{ fontSize: "18px", flex: "none", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}></i>
                      <div style={{ flex: "1 1 180px", minWidth: "0" }}>
                        <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13.5px" }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.note}
                        </div>
                      </div>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: s.color, flex: "none" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color }}></span>
                        {s.state}
                      </span>
                      <button className="btn btn-secondary" style={{ fontSize: "12px", flex: "none" }}>
                        Beheren
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <div className="field">
                  <label>
                    Standaard Vercel-team
                  </label>
                  <input className="input" defaultValue="team_ronklaren" />
                </div>
                <div className="field">
                  <label>
                    Standaard database-regio
                  </label>
                  <input className="input" defaultValue="eu-central-1" />
                </div>
                <div className="field">
                  <label>
                    Statusfeed
                  </label>
                  <input className="input" defaultValue="Elke 60 seconden" />
                </div>
              </div>
            </div>
          </>
        ) : null}
        {setTabAI ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Model &amp; gedrag
                </h6>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--space-3)" }}>
                  <div className="field">
                    <label>
                      Model voor generatie
                    </label>
                    <input className="input" defaultValue="Claude Sonnet" />
                  </div>
                  <div className="field">
                    <label>
                      Model voor korte edits
                    </label>
                    <input className="input" defaultValue="Claude Haiku" />
                  </div>
                  <div className="field">
                    <label>
                      Taal van output
                    </label>
                    <input className="input" defaultValue="Nederlands" />
                  </div>
                  <div className="field">
                    <label>
                      Creativiteit
                    </label>
                    <input className="input" defaultValue="Gemiddeld" />
                  </div>
                </div>
                <div className="field">
                  <label>
                    Systeeminstructies
                  </label>
                  <textarea className="input" style={{ minHeight: "110px" }} defaultValue="Schrijf zakelijk Nederlands, gebruik altijd de design kit van de klant, verzin geen cijfers of claims en houd secties kort." />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <h6 style={{ margin: "0", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                  Credits &amp; limieten
                </h6>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "var(--space-3)" }}>
                  <div className="field">
                    <label>
                      Credits Starter
                    </label>
                    <input className="input" defaultValue="250 / maand" />
                  </div>
                  <div className="field">
                    <label>
                      Credits Pro
                    </label>
                    <input className="input" defaultValue="1.500 / maand" />
                  </div>
                  <div className="field">
                    <label>
                      Credits Agency
                    </label>
                    <input className="input" defaultValue="8.000 / maand" />
                  </div>
                  <div className="field">
                    <label>
                      Extra credits
                    </label>
                    <input className="input" defaultValue="€ 0,04 per credit" />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  <label className="radio" style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    <input type="checkbox" defaultChecked />
                    <span className="dot"></span>
                    Klant mag zelf sites genereren
                  </label>
                  <label className="radio" style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    <input type="checkbox" defaultChecked />
                    <span className="dot"></span>
                    Gegenereerde pagina's eerst als concept
                  </label>
                  <label className="radio" style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    <input type="checkbox" />
                    <span className="dot"></span>
                    AI mag publiceren zonder goedkeuring
                  </label>
                  <label className="radio" style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                    <input type="checkbox" defaultChecked />
                    <span className="dot"></span>
                    Klantdata uitsluiten van modeltraining
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {setStubShow ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-6)", borderRadius: "var(--radius-md)", border: "1px dashed var(--color-neutral-700)", background: "var(--color-surface)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "16px" }}>
                {setStubTitle}
              </div>
              <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
                Voorstel voor wat hier thuishoort — zeg welke je wilt uitwerken:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {setStubItems.map((i, __i4) => (
                  <Fragment key={__i4}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "13px" }}>
                      <i className="ph ph-dot-outline" style={{ fontSize: "16px", color: "var(--color-accent)", flex: "none" }}></i>
                      <span>
                        {i.t}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
