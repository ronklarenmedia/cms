"use client";

import { useAllFormFields } from "@payloadcms/ui";
import React, { useEffect, useState } from "react";
import { THEME_FIELD_NAMES } from "../collections/fields/themeFieldNames";

type SiteTemplateOption = { id: string; name: string };

// Laad/opslaan van thema-presets via de bestaande site-templates-collection
// (zie doc: elk site-template is al name + thumbnail + theme, dus in feite
// al een preset). Leest/schrijft rechtstreeks in de live formulierstatus van
// het huidige Site-document, dus werkt ook vóór de eerste keer opslaan.
export const ThemePresets: React.FC = () => {
  const [fields, dispatchFields] = useAllFormFields();
  const [templates, setTemplates] = useState<SiteTemplateOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [presetName, setPresetName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchTemplates = async () => {
    const res = await fetch("/api/site-templates?limit=100&depth=0", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setTemplates((data.docs ?? []).map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })));
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPreset = async () => {
    if (!selectedId) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/site-templates/${selectedId}?depth=0`, { credentials: "include" });
      if (!res.ok) throw new Error("Kon preset niet ophalen.");
      const doc = await res.json();
      const theme = (doc.theme ?? {}) as Record<string, unknown>;
      for (const key of THEME_FIELD_NAMES) {
        const value = theme[key];
        if (value !== undefined) {
          dispatchFields({ type: "UPDATE", path: `theme.${key}`, value, valid: true });
        }
      }
      setStatus(`Preset "${doc.name}" geladen. Vergeet niet op te slaan.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Laden mislukt.");
    } finally {
      setBusy(false);
    }
  };

  const saveAsPreset = async () => {
    if (!presetName.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      const theme: Record<string, unknown> = {};
      for (const key of THEME_FIELD_NAMES) {
        const value = fields[`theme.${key}`]?.value;
        if (value !== undefined && value !== "") theme[key] = value;
      }
      const res = await fetch("/api/site-templates", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: presetName.trim(), theme }),
      });
      if (!res.ok) throw new Error("Opslaan mislukt — heb je rechten om presets aan te maken?");
      setStatus(`Opgeslagen als nieuwe preset "${presetName.trim()}".`);
      setPresetName("");
      await fetchTemplates();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 480 }}>
      <div>
        <p style={{ marginBottom: "0.5rem" }}>Preset laden</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          >
            <option value="">Kies een preset...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            disabled={!selectedId || busy}
            onClick={loadPreset}
          >
            Laden
          </button>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: "0.5rem" }}>Opslaan als nieuwe preset</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Naam van de preset"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            disabled={!presetName.trim() || busy}
            onClick={saveAsPreset}
          >
            Opslaan
          </button>
        </div>
      </div>

      {status && <p style={{ opacity: 0.75, fontSize: "0.875rem" }}>{status}</p>}
    </div>
  );
};
