"use client";

import { z } from "zod";
import type { AnyBlock } from "@/blocks/contract";
import { ImageUpload } from "./ImageUpload";
import { fieldLabel, longTextKeys, placeholders, valueLabel } from "./labels";

// Het instellingenpaneel wordt uit de Zod-schema's van het block gegenereerd (via JSON Schema),
// zodat een nieuw block geen eigen formulier nodig heeft.
export type JS = {
  type?: string;
  enum?: string[];
  properties?: Record<string, JS>;
  required?: string[];
  items?: JS;
  default?: unknown;
  minItems?: number;
  maxItems?: number;
  maxLength?: number;
  pattern?: string;
};

const cache = new WeakMap<AnyBlock, { content: JS; settings: JS }>();
export function blockJsonSchemas(block: AnyBlock) {
  let s = cache.get(block);
  if (!s) {
    const opts = { io: "input", unrepresentable: "any" } as const;
    s = {
      content: z.toJSONSchema(block.content, opts) as JS,
      settings: z.toJSONSchema(block.settings, opts) as JS,
    };
    cache.set(block, s);
  }
  return s;
}

/** Een geldige beginwaarde voor een (nieuw) veld: defaults, en voor verplichte velden een placeholder. */
function blankValue(schema: JS, key: string): unknown {
  if (schema.default !== undefined) return structuredClone(schema.default);
  if (schema.enum) return schema.enum[0];
  switch (schema.type) {
    case "string":
      return placeholders[key] ?? "Nieuw";
    case "boolean":
      return false;
    case "integer":
    case "number":
      return 1;
    case "array":
      return Array.from({ length: schema.minItems ?? 0 }, () => blankValue(schema.items ?? {}, key));
    case "object": {
      const out: Record<string, unknown> = {};
      for (const k of schema.required ?? []) out[k] = blankValue(schema.properties?.[k] ?? {}, k);
      return out;
    }
    default:
      return undefined;
  }
}

/** Velden die de upload zelf invult en die de redacteur niet hoeft te zien. */
const hiddenKeys = new Set(["srcset"]);

type Errors = Record<string, string>;
type Change = (next: unknown) => void;

function ErrorText({ message }: { message?: string }) {
  return message ? <span className="text-[10.5px] text-danger">{message}</span> : null;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-divider p-2.5">
      <span className="text-[11px] font-medium">{title}</span>
      {children}
    </div>
  );
}

function Field({
  name,
  schema,
  value,
  required,
  onChange,
  path,
  errors,
}: {
  name: string;
  schema: JS;
  value: unknown;
  required: boolean;
  onChange: Change;
  path: string;
  errors: Errors;
}) {
  const label = fieldLabel(name);
  const error = errors[path];
  const current = value === undefined ? schema.default : value;

  // Keuzelijst: een segment bij weinig opties, anders een select.
  if (schema.enum) {
    const options = schema.enum;
    if (options.length <= 3 && options.every((o) => valueLabel(name, o).length <= 12)) {
      return (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px]">{label}</span>
          <div className="seg flex text-[11px]">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                className="seg-opt"
                aria-pressed={current === o}
                style={{ flex: "1 1 0", minWidth: 0, padding: "5px 2px" }}
                onClick={() => onChange(o)}
              >
                {valueLabel(name, o)}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return (
      <label className="field" style={{ gap: 4 }}>
        <span className="text-[11px]">{label}</span>
        <select
          className="input"
          style={{ fontSize: 11.5, padding: "6px 8px" }}
          value={String(current ?? options[0])}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {valueLabel(name, o)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (schema.type === "boolean") {
    return (
      <label className="radio" style={{ fontSize: 11, gap: 6 }}>
        <input type="checkbox" checked={current === true} onChange={(e) => onChange(e.target.checked)} />
        <span className="dot" />
        <span>{label}</span>
      </label>
    );
  }

  if (schema.type === "string") {
    const long = longTextKeys.has(name) || (schema.maxLength ?? 0) >= 200;
    const commit = (raw: string) => onChange(raw === "" && !required ? undefined : raw);
    return (
      <label className="field" style={{ gap: 4 }}>
        <span className="flex items-baseline justify-between text-[11px]">
          {label}
          {schema.maxLength ? (
            <span className="text-[10px] text-text/55">
              {String(value ?? "").length}/{schema.maxLength}
            </span>
          ) : null}
        </span>
        {long ? (
          <textarea
            className="input"
            rows={3}
            value={String(value ?? "")}
            onChange={(e) => commit(e.target.value)}
            style={{ fontSize: 11.5, padding: "6px 8px", resize: "vertical" }}
          />
        ) : (
          <input
            className="input"
            type="text"
            // De builder levert een <datalist id="site-paths"> met de pagina's van de site; zonder die lijst doet dit niets.
            list={name === "href" ? "site-paths" : undefined}
            value={String(value ?? "")}
            onChange={(e) => commit(e.target.value)}
            style={{ fontSize: 11.5, padding: "6px 8px" }}
          />
        )}
        <ErrorText message={error} />
      </label>
    );
  }

  if (schema.type === "integer" || schema.type === "number") {
    return (
      <label className="field" style={{ gap: 4 }}>
        <span className="text-[11px]">{label}</span>
        <input
          className="input"
          type="number"
          value={value === undefined ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          style={{ fontSize: 11.5, padding: "6px 8px" }}
        />
        <ErrorText message={error} />
      </label>
    );
  }

  if (schema.type === "object") {
    // Optioneel object zonder standaardwaarde (bijv. de afbeelding): expliciet toevoegen/verwijderen.
    const optional = !required && schema.default === undefined;
    if (optional && value === undefined) {
      return (
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: 11.5, justifyContent: "center" }}
          onClick={() => onChange(blankValue(schema, name))}
        >
          <i className="ph ph-plus" /> {label} toevoegen
        </button>
      );
    }
    // Een afbeelding (url + alt) krijgt een voorbeeld en uploadknop boven de gewone velden.
    const isImage = Boolean(schema.properties?.url && schema.properties?.alt);
    return (
      <Group title={label}>
        {isImage ? <ImageUpload value={current} onChange={onChange} /> : null}
        <ObjectFields schema={schema} value={current} onChange={onChange} path={path} errors={errors} />
        {optional ? (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 11, justifyContent: "flex-start", padding: "2px 0" }}
            onClick={() => onChange(undefined)}
          >
            <i className="ph ph-trash" /> {label} verwijderen
          </button>
        ) : null}
      </Group>
    );
  }

  if (schema.type === "array") {
    const list = Array.isArray(current) ? (current as unknown[]) : [];
    const itemSchema = schema.items ?? {};
    const min = schema.minItems ?? 0;
    const max = schema.maxItems ?? Infinity;
    const replace = (next: unknown[]) => onChange(next);
    const move = (i: number, d: number) => {
      const next = [...list];
      const [item] = next.splice(i, 1);
      next.splice(i + d, 0, item);
      replace(next);
    };
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[11px]">
          {label} <span className="text-text/55">({list.length})</span>
        </span>
        {list.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-md border border-divider p-2.5">
            <div className="flex items-center gap-1">
              <span className="flex-1 text-[10.5px] uppercase tracking-wide text-text/60">#{i + 1}</span>
              <button type="button" className="btn btn-ghost size-5 !p-0" title="Omhoog" disabled={i === 0} onClick={() => move(i, -1)}>
                <i className="ph ph-arrow-up text-[12px]" />
              </button>
              <button type="button" className="btn btn-ghost size-5 !p-0" title="Omlaag" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                <i className="ph ph-arrow-down text-[12px]" />
              </button>
              <button
                type="button"
                className="btn btn-ghost size-5 !p-0"
                title="Verwijderen"
                disabled={list.length <= min}
                onClick={() => replace(list.filter((_, j) => j !== i))}
              >
                <i className="ph ph-trash text-[12px]" />
              </button>
            </div>
            {itemSchema.type === "object" ? (
              <ObjectFields
                schema={itemSchema}
                value={item}
                onChange={(v) => replace(list.map((x, j) => (j === i ? v : x)))}
                path={`${path}.${i}`}
                errors={errors}
              />
            ) : (
              <Field
                name={name}
                schema={itemSchema}
                value={item}
                required
                onChange={(v) => replace(list.map((x, j) => (j === i ? v : x)))}
                path={`${path}.${i}`}
                errors={errors}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: 11.5, justifyContent: "center" }}
          disabled={list.length >= max}
          onClick={() => replace([...list, blankValue(itemSchema, name)])}
        >
          <i className="ph ph-plus" /> Toevoegen
        </button>
        <ErrorText message={error} />
      </div>
    );
  }

  return null;
}

function ObjectFields({
  schema,
  value,
  onChange,
  path,
  errors,
}: {
  schema: JS;
  value: unknown;
  onChange: Change;
  path: string;
  errors: Errors;
}) {
  const obj = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const required = new Set(schema.required ?? []);
  const set = (key: string, next: unknown) => {
    const copy = { ...obj };
    if (next === undefined) delete copy[key];
    else copy[key] = next;
    // Een handmatig gewijzigd adres hoort niet meer bij de varianten van de vorige upload.
    if (key === "url") delete copy.srcset;
    onChange(copy);
  };
  return (
    <>
      {Object.entries(schema.properties ?? {})
        .filter(([key]) => !hiddenKeys.has(key))
        .map(([key, prop]) => (
          <Field
            key={key}
            name={key}
            schema={prop}
            value={obj[key]}
            required={required.has(key)}
            onChange={(next) => set(key, next)}
            path={path ? `${path}.${key}` : key}
            errors={errors}
          />
        ))}
    </>
  );
}

/** Formulier voor één deel (content of settings) van een sectie. `root` is het pad-prefix in de foutmeldingen. */
export function SchemaFields({
  schema,
  value,
  onChange,
  root,
  errors,
}: {
  schema: JS;
  value: unknown;
  onChange: (next: Record<string, unknown>) => void;
  root: "content" | "settings";
  errors: Errors;
}) {
  return (
    <ObjectFields
      schema={schema}
      value={value}
      onChange={(next) => onChange(next as Record<string, unknown>)}
      path={root}
      errors={errors}
    />
  );
}
