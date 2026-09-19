"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "@/blocks/blocks.css";
import { BlockSection } from "@/blocks/BlockRenderer";
import { CATEGORIES, type AnyBlock, type Status } from "@/blocks/contract";
import { blocks } from "@/blocks/registry";
import { themeToCssVars } from "@/blocks/theme";
import { categoryIcons, categoryId, statusMeta } from "./meta";
import { ScaledFrame } from "./ScaledFrame";

export type BlockFacts = { sites: number; tokens: number };

const themeVars = themeToCssVars();

function Preview({ block }: { block: AnyBlock }) {
  const fixture = block.fixtures[0];
  return (
    <div
      className="aspect-[16/10] overflow-hidden rounded-md bg-white shadow-[var(--shadow-sm)]"
      // Alleen een plaatje: geen focus of klikken in de miniatuur zelf.
      inert
      aria-hidden
    >
      <ScaledFrame width={1200} clip>
        <div style={{ ...themeVars, background: "var(--var-color-white)" }}>
          <BlockSection
            section={{
              id: `preview-${block.slug}`,
              type: block.slug,
              variant: fixture.variant,
              content: fixture.content,
              settings: fixture.settings,
            }}
          />
        </div>
      </ScaledFrame>
    </div>
  );
}

export function ComponentsOverview({ facts }: { facts: Record<string, BlockFacts> }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blocks.filter(
      (b) =>
        (status === "all" || b.status === status) &&
        (!q || [b.label, b.description, b.slug, b.category].some((t) => t.toLowerCase().includes(q))),
    );
  }, [query, status]);

  const groups = CATEGORIES.map((category) => ({
    category,
    items: visible.filter((b) => b.category === category),
  })).filter((g) => g.items.length > 0);

  const variantCount = blocks.reduce((n, b) => n + b.variants.length, 0);

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="flex flex-wrap items-end gap-[var(--space-6)]">
        <div className="min-w-[220px] flex-1">
          <h2 className="!mb-1">Componenten</h2>
          <div className="text-muted text-[12.5px]">
            {blocks.length} componenten · {variantCount} varianten · gesorteerd op type
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="field w-[220px]">
            <input
              className="input"
              type="search"
              placeholder="Zoek component"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Zoek component"
            />
          </div>
          <select
            className="input !w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | Status)}
            aria-label="Filter op status"
          >
            <option value="all">Alle statussen</option>
            {(Object.keys(statusMeta) as Status[]).map((s) => (
              <option key={s} value={s}>
                {statusMeta[s].label}
              </option>
            ))}
          </select>
          <Link href="/componenten/showcase" className="btn btn-secondary">
            <i className="ph ph-eye" />
            Showcase
          </Link>
        </div>
      </div>

      {groups.length > 1 ? (
        <div className="flex flex-wrap gap-1 border-b border-divider pb-3">
          {groups.map((g) => (
            <a
              key={g.category}
              href={`#c-${categoryId(g.category)}`}
              className="hv2 inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1 text-[12px] !text-accent-200 no-underline"
            >
              {g.category}
              <span className="text-[10.5px] opacity-60">{g.items.length}</span>
            </a>
          ))}
        </div>
      ) : null}

      {groups.length === 0 ? (
        <div className="text-muted text-[13px]">Geen componenten gevonden voor deze zoekopdracht.</div>
      ) : null}

      {groups.map((g) => (
        <section key={g.category} id={`c-${categoryId(g.category)}`} className="mb-[var(--space-8)] flex scroll-mt-6 flex-col gap-3">
          <div className="flex items-center gap-3">
            <i className={`ph ph-${categoryIcons[g.category]} text-[17px] text-accent`} />
            <span className="font-heading text-[17px] font-medium leading-none">{g.category}</span>
            <span className="text-muted whitespace-nowrap text-[11px]">
              {g.items.length} {g.items.length === 1 ? "component" : "componenten"}
            </span>
            <span className="h-px flex-1 bg-[linear-gradient(to_right,var(--color-divider),transparent)]" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {g.items.map((b) => {
              const f = facts[b.slug] ?? { sites: 0, tokens: 0 };
              return (
                // Geen <Link> om de hele kaart: de miniatuur bevat zelf links (knoppen van het block), en
                // geneste <a>'s zijn ongeldige HTML. De titel-link wordt daarom over de kaart uitgerekt.
                <div key={b.slug} className="hv4 relative flex flex-col gap-2">
                  <Preview block={b} />
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/componenten/editor?block=${b.slug}`}
                        className="font-heading text-[13.5px] font-medium !text-text no-underline after:absolute after:inset-0"
                      >
                        {b.label}
                      </Link>
                      <div className="text-muted text-[11.5px]">
                        {f.sites === 0 ? "Nog niet gebruikt" : `in ${f.sites} ${f.sites === 1 ? "site" : "sites"}`}
                      </div>
                      <div className="text-muted text-[11px]">
                        {b.variants.length} varianten · {f.tokens} tokens
                      </div>
                    </div>
                    <span className={`${statusMeta[b.status].tag} flex-none !text-[10px]`}>{statusMeta[b.status].label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-muted !mb-0 max-w-[640px] text-[12px]">
        Een nieuw component toevoegen? Blocks worden in code gebouwd volgens <code>src/blocks/README.md</code> en verschijnen
        hier automatisch zodra ze zijn geregistreerd.
      </p>
    </div>
  );
}
