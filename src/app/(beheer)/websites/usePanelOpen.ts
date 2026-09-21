"use client";

import { useCallback, useSyncExternalStore } from "react";

// Of een zijkolom van de builder open of ingeklapt is; de keuze blijft bewaard in de browser (localStorage). Standaard open.
// useSyncExternalStore: de server en de eerste weergave in de browser tonen altijd "open" (geen hydratatiefout); daarna volgt de bewaarde keuze.
// Werkt opslaan niet (privévenster, geblokkeerde site-data), dan onthoudt `memory` de keuze zolang de pagina openstaat.

const listeners = new Set<() => void>();
const memory = new Map<string, boolean>();

function read(key: string): boolean {
  const remembered = memory.get(key);
  if (remembered !== undefined) return remembered;
  try {
    return window.localStorage.getItem(key) !== "closed";
  } catch {
    return true;
  }
}

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  window.addEventListener("storage", notify); // een ander tabblad wijzigde de keuze
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
};

export function usePanelOpen(key: string): readonly [boolean, (open: boolean) => void] {
  const open = useSyncExternalStore(subscribe, () => read(key), () => true);
  const setOpen = useCallback(
    (next: boolean) => {
      memory.set(key, next);
      try {
        window.localStorage.setItem(key, next ? "open" : "closed");
      } catch {
        // Niet op te slaan: de keuze geldt dan alleen zolang deze pagina openstaat.
      }
      listeners.forEach((notify) => notify());
    },
    [key],
  );
  return [open, setOpen] as const;
}
