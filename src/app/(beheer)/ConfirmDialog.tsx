"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";

// Een bevestigingsvraag in de pagina, in plaats van `window.confirm`. Dat laatste doet in sommige browsers (o.a. ingebedde browsers en
// vensters die dialogen onderdrukken) stilzwijgend niets: de knop lijkt dan kapot. Gebruik:
//
//   const [confirm, confirmDialog] = useConfirm();
//   if (!(await confirm("Pagina verwijderen?", { confirmLabel: "Verwijderen", danger: true }))) return;
//   …en `{confirmDialog}` ergens in de JSX van hetzelfde component.

type Options = { title?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean };
type Pending = { message: string } & Options;

export function useConfirm(): readonly [(message: string, options?: Options) => Promise<boolean>, ReactElement | null] {
  const [pending, setPending] = useState<Pending | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const answer = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setPending(null);
  }, []);

  const confirm = useCallback((message: string, options: Options = {}) => {
    return new Promise<boolean>((resolve) => {
      resolver.current?.(false); // een nog openstaande vraag telt als "nee"
      resolver.current = resolve;
      setPending({ message, ...options });
    });
  }, []);

  return [confirm, pending ? <ConfirmDialog {...pending} onAnswer={answer} /> : null] as const;
}

function ConfirmDialog({ message, title = "Weet je het zeker?", confirmLabel = "Ja", cancelLabel = "Annuleren", danger = false, onAnswer }: Pending & { onAnswer: (ok: boolean) => void }) {
  const cancel = useRef<HTMLButtonElement>(null);

  // Escape beantwoordt alleen deze vraag: in de capture-fase, zodat een dialoog eronder (die zelf op Escape sluit) niet ook dichtgaat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onAnswer(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onAnswer]);

  // De veilige keuze krijgt de focus, zodat een losse Enter niets verwijdert.
  useEffect(() => cancel.current?.focus(), []);

  return createPortal(
    // stopPropagation: React laat gebeurtenissen ook via een portal naar de ouders bubbelen (bijv. de achtergrond van de dialoog eronder).
    <div className="fixed inset-0 z-[60] grid place-items-center bg-text/50 p-6" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" onClick={(e) => { e.stopPropagation(); onAnswer(false); }}>
      <div className="flex w-full max-w-[420px] flex-col gap-4 rounded-lg bg-surface p-6 shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()}>
        <h5 id="confirm-title" className="!m-0">
          {title}
        </h5>
        <p id="confirm-message" className="m-0 text-[13.5px] text-text/85">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button ref={cancel} type="button" className="btn btn-secondary" onClick={() => onAnswer(false)}>
            {cancelLabel}
          </button>
          <button type="button" className={danger ? "btn btn-primary !bg-danger !border-danger" : "btn btn-primary"} onClick={() => onAnswer(true)}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
