"use client";

import { useAllFormFields } from "@payloadcms/ui";
import React from "react";
import { THEME_FIELD_NAMES } from "../collections/fields/themeFieldNames";

// Live voorbeeld van de huidige thema-waarden (bewerkte formulierstatus, dus
// werkt ook meteen na "Preset laden" of handmatige aanpassingen, vóór
// opslaan). Alleen zichtbaar in de CMS-admin — dit rendert géén styling die
// naar de site gaat, het demonstreert enkel hoe de --var-* tokens (zie
// .claude/skills/theme-field-schema/SKILL.md) er visueel uit zien.
function toKebabVar(key: string): string {
  return `--var-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
}

export const ThemePreview: React.FC = () => {
  const [fields] = useAllFormFields();

  const vars: Record<string, string> = {};
  for (const key of THEME_FIELD_NAMES) {
    const value = fields[`theme.${key}`]?.value;
    if (value !== undefined && value !== null && value !== "") {
      vars[toKebabVar(key)] = String(value);
    }
  }

  return (
    <div style={{ ...vars, marginTop: "0.5rem" } as React.CSSProperties}>
      <style>{`
        .theme-preview-root {
          background: var(--var-color-bg-primary-light, #f8fafc);
          padding: var(--var-spacing-standard, 1rem);
          border-radius: var(--var-border-radius-standard, .5rem);
          border: 1px solid rgba(0,0,0,.08);
        }
        .theme-preview-card {
          background: var(--var-color-white, #fff);
          border-radius: var(--var-border-radius-medium, .75rem);
          box-shadow: var(--var-box-shadow-large, 0 8px 24px rgba(0,0,0,.14));
          padding: var(--var-spacing-medium, 1.5rem);
          max-width: var(--var-max-width-small, 640px);
          font-family: var(--var-font-family-text, inherit);
          color: var(--var-color-text, #1e293b);
        }
        .theme-preview-heading {
          font-family: var(--var-font-family-primary, inherit);
          font-size: var(--var-font-size-large, 1.5rem);
          font-weight: var(--var-font-weight-bold, 700);
          line-height: var(--var-line-height-tight, 1.2);
          letter-spacing: var(--var-letter-spacing-tight, 0);
          color: var(--var-color-primary, #4338ca);
          margin: 0 0 var(--var-spacing-small, .5rem);
        }
        .theme-preview-body {
          font-size: var(--var-font-size-standard, 1rem);
          line-height: var(--var-line-height-standard, 1.5);
          margin: 0 0 var(--var-spacing-standard, 1rem);
        }
        .theme-preview-row {
          display: flex;
          gap: var(--var-spacing-small, .5rem);
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: var(--var-spacing-standard, 1rem);
        }
        .theme-preview-btn-primary {
          background: var(--var-color-primary, #4338ca);
          color: var(--var-color-white, #fff);
          border: none;
          padding: .5rem 1rem;
          border-radius: var(--var-border-radius-standard, .5rem);
          box-shadow: var(--var-box-shadow-standard, none);
          font-weight: var(--var-font-weight-medium, 500);
          font-size: var(--var-font-size-small, .875rem);
          transition: var(--var-transition-standard, 200ms ease);
        }
        .theme-preview-btn-secondary {
          background: var(--var-color-bg-secondary-light, #eef2ff);
          color: var(--var-color-secondary, #6366f1);
          border: var(--var-border-width-thin, 1px) solid var(--var-color-secondary, #6366f1);
          padding: .5rem 1rem;
          border-radius: var(--var-border-radius-standard, .5rem);
          font-size: var(--var-font-size-small, .875rem);
        }
        .theme-preview-swatches {
          display: flex;
          gap: .375rem;
          flex-wrap: wrap;
          margin-bottom: var(--var-spacing-standard, 1rem);
        }
        .theme-preview-swatch {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: var(--var-border-radius-small, .25rem);
          border: 1px solid rgba(0,0,0,.1);
        }
        .theme-preview-badge {
          display: inline-block;
          padding: .15rem .6rem;
          border-radius: var(--var-border-radius-full, 9999px);
          font-size: var(--var-font-size-xs, .75rem);
          font-weight: var(--var-font-weight-medium, 500);
          color: #fff;
        }
      `}</style>

      <p style={{ marginBottom: "0.5rem" }}>Voorbeeld (live, op basis van huidige waarden)</p>

      <div className="theme-preview-root">
        <div className="theme-preview-card">
          <div className="theme-preview-swatches">
            {[
              "--var-color-primary",
              "--var-color-secondary",
              "--var-color-accent",
              "--var-color-bg-primary-dark",
              "--var-color-text",
            ].map((v) => (
              <div key={v} className="theme-preview-swatch" style={{ background: `var(${v}, #e2e8f0)` }} />
            ))}
          </div>

          <h3 className="theme-preview-heading">Voorbeeldtitel</h3>
          <p className="theme-preview-body">
            Dit is een voorbeeldalinea die laat zien hoe de tekstgrootte, regelhoogte en kleur van het thema
            samen ogen.
          </p>

          <div className="theme-preview-row">
            <button type="button" className="theme-preview-btn-primary">
              Primaire knop
            </button>
            <button type="button" className="theme-preview-btn-secondary">
              Secundaire knop
            </button>
          </div>

          <div className="theme-preview-row" style={{ marginBottom: 0 }}>
            <span className="theme-preview-badge" style={{ background: "var(--var-color-success, #16a34a)" }}>
              Succes
            </span>
            <span className="theme-preview-badge" style={{ background: "var(--var-color-warning, #f59e0b)" }}>
              Waarschuwing
            </span>
            <span className="theme-preview-badge" style={{ background: "var(--var-color-error, #dc2626)" }}>
              Fout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
