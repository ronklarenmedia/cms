/* eslint-disable */
// @ts-nocheck
// Gegenereerd uit de Claude Design-mockup "Multi-tenant AI webbuilder mockups".
import Link from "next/link";
import { Fragment } from "react";
import type { Vals } from "../logic";

export function KlantenScreen({ v }: { v: Vals }) {
  const { alphabet, klantCount, letterGroups, pageMax } = v;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: pageMax }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "220px" }}>
            <h2 style={{ margin: "0 0 4px" }}>
              Klanten
            </h2>
            <div style={{ fontSize: "12.5px", color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
              {klantCount} · alfabetisch gesorteerd
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div className="field" style={{ width: "220px" }}>
              <input className="input" type="search" placeholder="Zoek op naam of contact" />
            </div>
            <button className="btn btn-secondary">
              <i className="ph ph-funnel"></i>
              Filter
            </button>
            <Link className="btn btn-primary" href="/klanten/nieuw">
              <i className="ph ph-plus"></i>
              Nieuwe klant
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
          {alphabet.map((a, __i2) => (
            <Fragment key={__i2}>
              <a className="hv2" href={a.href} style={{ width: "24px", height: "24px", display: "grid", placeItems: "center", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "11.5px", textDecoration: "none", color: a.color, background: a.bg }}>
                {a.letter}
              </a>
            </Fragment>
          ))}
        </div>
        {letterGroups.length === 0 ? (
          <div style={{ border: "1px dashed var(--color-neutral-700)", borderRadius: "var(--radius-lg)", padding: "var(--space-8)", textAlign: "center", fontSize: "13px", color: "color-mix(in srgb, var(--color-text) 62%, transparent)" }}>
            Nog geen klanten. Voeg de eerste toe met &ldquo;Nieuwe klant&rdquo;.
          </div>
        ) : null}
        {letterGroups.map((g, __i1) => (
          <Fragment key={__i1}>
            <div id={`k-${g.letter}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", scrollMarginTop: "var(--space-6)", marginBottom: "var(--space-8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "20px", color: "var(--color-accent)", lineHeight: "1" }}>
                  {g.letter}
                </span>
                <span style={{ fontSize: "11px", color: "color-mix(in srgb, var(--color-text) 68%, transparent)", whiteSpace: "nowrap" }}>
                  {g.count}
                </span>
                <span style={{ flex: "1", height: "1px", background: "linear-gradient(to right, var(--color-divider), transparent)" }}></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "var(--space-3)" }}>
                {g.items.map((c, __i4) => (
                  <Fragment key={__i4}>
                    <Link href={`/klanten/${c.id}`} className="card elev-sm hv6" style={{ gap: "var(--space-3)", padding: "var(--space-4)", color: "inherit", textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                        <div style={{ width: "38px", height: "38px", flex: "none", borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", background: "var(--color-neutral-900)", boxShadow: "inset 0 0 0 1px var(--color-divider)", fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "13px", color: "var(--color-accent-300)" }} title="Logo — placeholder">
                          {c.monogram}
                        </div>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "500", fontSize: "15px", whiteSpace: "normal", textWrap: "pretty", overflowWrap: "anywhere" }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: "11.5px", color: "color-mix(in srgb, var(--color-text) 72%, transparent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.cp}
                          </div>
                        </div>
                        <span className={`${c.planTag}`} style={{ flex: "none" }}>
                          {c.plan}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "12px", color: "color-mix(in srgb, var(--color-text) 80%, transparent)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: "0" }}>
                          <i className="ph ph-phone" style={{ fontSize: "13px", flex: "none", color: "color-mix(in srgb, var(--color-text) 68%, transparent)" }}></i>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.tel}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: "0" }}>
                          <i className="ph ph-envelope-simple" style={{ fontSize: "13px", flex: "none", color: "color-mix(in srgb, var(--color-text) 68%, transparent)" }}></i>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.mail}
                          </span>
                        </div>
                      </div>
                      {c.services.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)", paddingTop: "var(--space-2)", borderTop: "1px solid var(--color-divider)" }}>
                        {c.services.map((s, __i7) => (
                          <Fragment key={__i7}>
                            <span className="tag tag-neutral" style={{ fontSize: "10.5px" }}>
                              {s.label}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      ) : null}
                    </Link>
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
