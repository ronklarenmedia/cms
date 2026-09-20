"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createKit } from "../actions";

export function NewKitForm({
  customers,
  sources,
  defaultBase,
  defaultName,
}: {
  customers: { id: string; name: string }[];
  sources: { id: string; name: string; platform: boolean }[];
  defaultBase: string;
  defaultName: string;
}) {
  const [state, action, pending] = useActionState(createKit, undefined);

  return (
    <form action={action} className="flex flex-col gap-[var(--space-6)]">
      <div className="field">
        <label htmlFor="name">Naam van de kit</label>
        <input id="name" name="name" type="text" required maxLength={255} defaultValue={defaultName} className="input" placeholder="Bijv. Meridian huisstijl" />
      </div>

      <div className="field">
        <label htmlFor="customerId">Voor wie</label>
        <select id="customerId" name="customerId" defaultValue="" className="input">
          <option value="">Platformkit (voor elke klant beschikbaar)</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              Alleen voor {c.name}
            </option>
          ))}
        </select>
        <div className="text-muted mt-1 text-[12px]">Dit kun je achteraf niet meer wijzigen: websites van andere klanten kunnen een klantkit niet gebruiken.</div>
      </div>

      <div className="field">
        <label htmlFor="base">Beginnen met</label>
        <select id="base" name="base" defaultValue={defaultBase} className="input">
          <option value="leeg">Het standaardthema (leeg)</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              Kopie van {s.name}
              {s.platform ? " (platform)" : ""}
            </option>
          ))}
        </select>
      </div>

      {state?.error ? (
        <div className="text-[12.5px] text-danger" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Kit aanmaken…" : "Kit aanmaken en bewerken"}
        </button>
        <Link href="/design-kits" className="btn btn-ghost">
          Annuleren
        </Link>
      </div>
    </form>
  );
}
