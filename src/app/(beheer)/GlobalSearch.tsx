"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { MIN_QUERY, type SearchGroup } from "@/lib/search-types";
import { searchPlatform } from "./search";

// De zoekbalk bovenin het beheer: zoekt in klanten, websites, pagina's en design kits. Een uitklaplijst onder het veld,
// bedienbaar met het toetsenbord (↑ ↓ Enter Esc; "/" of ⌘K/Ctrl+K om te focussen).

type Outcome = { query: string; groups: SearchGroup[] } | { query: string; error: string };

/** Zet de gevonden tekst in de titel vet, zonder HTML te gebruiken. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = text.toLowerCase().indexOf(query.toLowerCase());
  if (at < 0 || !query) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[2px] bg-accent/20 text-inherit">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

const isTyping = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export function GlobalSearch() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [active, setActive] = useState(0);

  const q = query.trim();
  const tooShort = q.length < MIN_QUERY;
  // Wat er staat, hoort bij de huidige zoekterm; een oudere uitkomst telt niet (dan is het nog laden).
  const current = outcome && outcome.query === q ? outcome : null;
  const groups = current && "groups" in current ? current.groups : [];
  const flat = groups.flatMap((g) => g.items);
  const activeIndex = Math.min(active, Math.max(0, flat.length - 1));

  // Zoeken met een korte vertraging, zodat niet elke toets een aanvraag is. Alleen het antwoord op de laatste zoekterm wordt bewaard.
  useEffect(() => {
    if (tooShort) return;
    let stale = false;
    const timer = setTimeout(async () => {
      try {
        const res = await searchPlatform(q);
        if (stale) return;
        setOutcome("error" in res ? { query: q, error: res.error } : { query: res.query, groups: res.groups });
        setActive(0);
      } catch {
        if (!stale) setOutcome({ query: q, error: "Zoeken is mislukt. Controleer je verbinding en probeer het opnieuw." });
      }
    }, 200);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [q, tooShort]);

  // "/" of ⌘K / Ctrl+K zet de cursor in de zoekbalk (niet als je al in een invoerveld typt).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (combo || (e.key === "/" && !isTyping(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Buiten de zoekbalk klikken sluit de lijst.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    inputRef.current?.blur();
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (open) setOpen(false);
      else if (query) setQuery("");
      else close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (flat.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActive((activeIndex + (e.key === "ArrowDown" ? 1 : flat.length - 1)) % flat.length);
    } else if (e.key === "Enter" && open && flat[activeIndex]) {
      e.preventDefault();
      go(flat[activeIndex].href);
    }
  };

  const showPanel = open && q.length > 0;

  return (
    <div ref={wrapRef} className="relative min-w-0 max-w-[440px] flex-1">
      <i className="ph ph-magnifying-glass pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-text/70" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showPanel && flat.length > 0 ? `${listId}-${activeIndex}` : undefined}
        aria-label="Zoeken in klanten, websites, pagina's en design kits"
        placeholder="Zoek klanten, websites, pagina's of design kits"
        title="Sneltoets: / of ⌘K"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="input !pl-8"
      />

      {showPanel ? (
        <div id={listId} role="listbox" aria-label="Zoekresultaten" className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[70vh] overflow-auto rounded-md border border-divider bg-surface p-1 shadow-[var(--shadow-lg)]">
          {tooShort ? (
            <p className="text-muted m-0 px-3 py-2.5 text-[12.5px]">Typ minimaal {MIN_QUERY} tekens.</p>
          ) : current && "error" in current ? (
            <p role="alert" className="m-0 px-3 py-2.5 text-[12.5px] text-danger">
              {current.error}
            </p>
          ) : !current ? (
            <p className="text-muted m-0 px-3 py-2.5 text-[12.5px]" aria-live="polite">
              Zoeken…
            </p>
          ) : groups.length === 0 ? (
            <p className="text-muted m-0 px-3 py-2.5 text-[12.5px]" aria-live="polite">
              Niets gevonden voor &ldquo;{q}&rdquo;.
            </p>
          ) : (
            groups.map((g) => (
              <div key={g.key} role="group" aria-label={g.label}>
                <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-[10.5px] tracking-[0.08em] text-text/60 uppercase">
                  <i className={`ph ph-${g.icon} text-[12px]`} aria-hidden="true" />
                  {g.label}
                </div>
                {g.items.map((item) => {
                  const index = flat.indexOf(item);
                  return (
                    <Link
                      key={item.href}
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      href={item.href}
                      onClick={close}
                      onMouseEnter={() => setActive(index)}
                      className={`flex flex-col rounded-sm px-2.5 py-1.5 !text-inherit no-underline ${index === activeIndex ? "bg-accent/12" : ""}`}
                    >
                      <span className="truncate text-[13px] font-medium">
                        <Highlight text={item.title} query={q} />
                      </span>
                      <span className="text-muted truncate text-[11.5px]">{item.subtitle}</span>
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
