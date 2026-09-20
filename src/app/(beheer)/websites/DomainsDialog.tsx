"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { addSiteDomain, getSiteDomains, makeDomainPrimary, removeSiteDomain, type DomainItem, type DomainsInfo } from "./domains";

type Load = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; info: DomainsInfo };

/** Een kaal domein (klant.nl) krijgt een A-record, een subdomein (www.klant.nl) een CNAME. Een aanname op basis van het aantal delen; Vercel geeft de definitieve waarden. */
const isSubdomain = (hostname: string) => hostname.split(".").length > 2;

function Copy({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost !px-1.5 !py-0.5 text-[11px]"
      title="Kopiëren"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // klembord niet beschikbaar: de waarde staat er gewoon, dan handmatig kopiëren
        }
      }}
    >
      <i className={`ph ${done ? "ph-check" : "ph-copy"}`} aria-hidden="true" /> {done ? "Gekopieerd" : "Kopieer"}
    </button>
  );
}

function Record({ type, name, value }: { type: string; name: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm bg-neutral-900 px-2.5 py-1.5 text-[11.5px]">
      <span className="w-12 flex-none font-medium">{type}</span>
      <span className="text-text/60">Naam</span>
      <code className="break-all">{name}</code>
      <span className="text-text/60">Waarde</span>
      <code className="break-all">{value}</code>
      <span className="ml-auto">
        <Copy value={value} />
      </span>
    </div>
  );
}

function Instructions({ item, providerConfigured }: { item: DomainItem; providerConfigured: boolean }) {
  const { detail } = item;
  const sub = isSubdomain(item.hostname);
  if (!providerConfigured) {
    return (
      <p className="m-0 text-[11.5px] text-text/70">
        Vercel is nog niet gekoppeld (zie Instellingen → Koppelingen). Het domein is opgeslagen; de DNS-records en de controle volgen zodra de koppeling is ingesteld.
      </p>
    );
  }
  if (!detail) return <p className="m-0 text-[11.5px] text-danger">{item.note ?? "De stand van dit domein kon niet worden opgehaald."}</p>;
  const a = detail.a[0];
  return (
    <div className="flex flex-col gap-2 text-[11.5px]">
      {detail.verification.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="font-medium">Stap 1 — bewijs dat het domein van de klant is</span>
          <span className="text-text/70">Dit domein hangt al aan een ander Vercel-project. Maak dit record aan bij de DNS-beheerder van de klant:</span>
          {detail.verification.map((v) => (
            <Record key={`${v.type}-${v.domain}`} type={v.type} name={v.domain} value={v.value} />
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <span className="font-medium">{detail.verification.length > 0 ? "Stap 2 — laat het domein naar de website wijzen" : "Laat het domein naar de website wijzen"}</span>
        <span className="text-text/70">Bij de DNS-beheerder van de klant (meestal de registrar of hostingpartij). Uw e-mail (MX-records) blijft ongemoeid.</span>
        {[
          { key: "a", show: Boolean(a), node: a ? <Record type="A" name={item.hostname} value={a} /> : null, hint: "voor een kaal domein zoals klant.nl", likely: !sub },
          { key: "cname", show: Boolean(detail.cname), node: detail.cname ? <Record type="CNAME" name={item.hostname} value={detail.cname} /> : null, hint: "voor een subdomein zoals www.klant.nl", likely: sub },
        ]
          .filter((r) => r.show)
          .sort((x, y) => Number(y.likely) - Number(x.likely))
          .map((r) => (
            <div key={r.key} className="flex flex-col gap-1">
              {r.node}
              <span className="text-[10.5px] text-text/55">{r.hint}{r.likely ? " — waarschijnlijk dit record" : ""}</span>
            </div>
          ))}
        {!a && !detail.cname ? <span className="text-text/70">Vercel heeft nog geen records doorgegeven. Klik op &ldquo;Controleer nu&rdquo;.</span> : null}
        <span className="text-text/55">Het kan tot 48 uur duren voordat een wijziging overal zichtbaar is.</span>
      </div>
    </div>
  );
}

/** Beheer van de eigen domeinen van een site: toevoegen, DNS-instructies, controleren, primair maken en verwijderen. */
export function DomainsDialog({ siteId, canDelete, onClose }: { siteId: string; canDelete: boolean; onClose: () => void }) {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    let stale = false;
    (async () => {
      try {
        // Eerst de opgeslagen domeinen tonen, daarna de actuele stand bij Vercel ophalen.
        const quick = await getSiteDomains(siteId);
        if (stale) return;
        setLoad(quick.ok ? { status: "ready", info: quick.info } : { status: "error", message: quick.error });
        if (!quick.ok || !quick.info.providerConfigured || quick.info.domains.length === 0) return;
        const full = await getSiteDomains(siteId, { refresh: true });
        if (!stale && full.ok) setLoad({ status: "ready", info: full.info });
      } catch {
        if (!stale) setLoad({ status: "error", message: "De domeinen konden niet worden geladen." });
      }
    })();
    return () => {
      stale = true;
    };
  }, [siteId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function run(key: string, action: () => Promise<{ ok: true; info: DomainsInfo } | { ok: false; error: string }>) {
    setBusy(key);
    setProblem(null);
    try {
      const res = await action();
      if (res.ok) setLoad({ status: "ready", info: res.info });
      else setProblem(res.error);
      return res.ok;
    } catch {
      setProblem("Er ging iets mis. Controleer je verbinding en probeer het opnieuw.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  const info = load.status === "ready" ? load.info : null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-text/40 p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label="Domeinen">
      <div
        className="flex max-h-[85vh] w-full max-w-[680px] flex-col gap-4 overflow-auto rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <h4 className="!mb-0 flex-1">Domeinen</h4>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} title="Sluiten" autoFocus>
            <i className="ph ph-x" />
          </button>
        </div>
        <p className="text-muted m-0 text-[12.5px]">
          Koppel het eigen domein van de klant. Het <strong>primaire</strong> domein is het adres waar bezoekers uitkomen: wie via een ander adres van deze website binnenkomt (bijvoorbeeld www of het voorbeeldadres), wordt daarheen
          doorgestuurd zodra dat domein actief is. Wilt u zowel <code>klant.nl</code> als <code>www.klant.nl</code>, voeg ze dan allebei toe.
        </p>

        {problem ? (
          <div role="alert" className="rounded-md border border-danger px-3 py-2 text-[12px] text-danger">
            {problem}
          </div>
        ) : null}
        {load.status === "loading" ? <p className="text-muted m-0 text-[13px]">Laden…</p> : null}
        {load.status === "error" ? <p className="m-0 text-[13px] text-danger">{load.message}</p> : null}

        {info?.previewHost ? (
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-divider px-3 py-2 text-[12px]">
            <i className="ph ph-eye-slash text-text/60" aria-hidden="true" />
            <span className="text-text/70">Voorbeeldadres:</span>
            <code>{info.previewHost}</code>
            <span className="ml-auto text-[10.5px] text-text/55">nooit in zoekmachines</span>
          </div>
        ) : null}

        {info && info.domains.length === 0 ? <p className="text-muted m-0 text-[13px]">Nog geen eigen domeinen gekoppeld.</p> : null}

        {info && info.domains.length > 0 ? (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {info.domains.map((d) => (
              <li key={d.id} className="flex flex-col gap-2.5 rounded-md border border-divider p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-medium">{d.hostname}</span>
                  {d.isPrimary ? <span className="tag tag-accent">Primair</span> : null}
                  <span className={d.status === "active" ? "tag tag-accent" : "tag tag-neutral"}>{d.status === "active" ? "Actief" : "In behandeling"}</span>
                  <span className="ml-auto flex flex-wrap items-center gap-1.5">
                    {d.status === "pending" && info.providerConfigured ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: 11.5 }}
                        disabled={busy !== null}
                        onClick={() => void run(`check-${d.id}`, () => getSiteDomains(siteId, { refresh: true, verify: true }))}
                      >
                        <i className={`ph ${busy === `check-${d.id}` ? "ph-spinner" : "ph-arrows-clockwise"}`} aria-hidden="true" /> Controleer nu
                      </button>
                    ) : null}
                    {!d.isPrimary ? (
                      <button type="button" className="btn btn-secondary" style={{ fontSize: 11.5 }} disabled={busy !== null} onClick={() => void run(`primary-${d.id}`, () => makeDomainPrimary(siteId, d.id))}>
                        Primair maken
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ fontSize: 11.5 }}
                        disabled={busy !== null}
                        title="Domein verwijderen"
                        onClick={() => {
                          if (window.confirm(`${d.hostname} loskoppelen van deze website? Bezoekers kunnen de site dan niet meer via dit adres bereiken.`)) void run(`remove-${d.id}`, () => removeSiteDomain(siteId, d.id));
                        }}
                      >
                        <i className={`ph ${busy === `remove-${d.id}` ? "ph-spinner" : "ph-trash"}`} aria-hidden="true" /> Verwijderen
                      </button>
                    ) : null}
                  </span>
                </div>
                {d.status === "pending" ? <Instructions item={d} providerConfigured={info.providerConfigured} /> : null}
              </li>
            ))}
          </ul>
        ) : null}

        {info ? (
          <form
            className="flex flex-col gap-1.5 border-t border-divider pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              void run("add", () => addSiteDomain(siteId, input)).then((ok) => ok && setInput(""));
            }}
          >
            <label className="field" style={{ gap: 4 }}>
              <span className="text-[11.5px]">Domein toevoegen</span>
              <span className="flex gap-2">
                <input
                  className="input"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="klant.nl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy !== null || info.domains.length >= info.maxDomains}
                  style={{ fontSize: 12.5 }}
                />
                <button type="submit" className="btn btn-primary" style={{ fontSize: 12 }} disabled={busy !== null || !input.trim() || info.domains.length >= info.maxDomains}>
                  <i className={`ph ${busy === "add" ? "ph-spinner" : "ph-plus"}`} aria-hidden="true" /> Toevoegen
                </button>
              </span>
            </label>
            <span className="text-[10.5px] text-text/55">
              {info.domains.length >= info.maxDomains ? `Maximaal ${info.maxDomains} domeinen per website bereikt.` : `Alleen de domeinnaam, zonder https:// of pad. Maximaal ${info.maxDomains} per website.`}
            </span>
          </form>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
