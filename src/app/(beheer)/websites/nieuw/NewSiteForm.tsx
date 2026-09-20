"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { SiteTheme } from "@/blocks/theme";
import { fontName, KitSwatches } from "../../design-kits/KitPreview";
import { createSite } from "../actions";
import { starters } from "../sections";

const choice =
  "flex cursor-pointer gap-3 rounded-md border border-divider p-3 has-[:checked]:border-accent has-[:checked]:bg-accent/8";

type Kit = { id: string; name: string; customerId: string | null; theme: SiteTheme };

export function NewSiteForm({ customers, kits }: { customers: { id: string; name: string }[]; kits: Kit[] }) {
  const [state, action, pending] = useActionState(createSite, undefined);
  const [customerId, setCustomerId] = useState("");
  const [kitId, setKitId] = useState<string | null>(null);

  // Platformkits zijn voor elke klant; een klantkit alleen voor die klant. Zolang er geen klant is gekozen, alleen de platformkits.
  const available = kits.filter((k) => k.customerId === null || k.customerId === customerId);
  // De keuze blijft geldig als de klant wisselt: een kit die niet meer beschikbaar is, valt terug op de eerste kit.
  const selected = available.find((k) => k.id === kitId)?.id ?? available[0]?.id ?? "";

  return (
    <form action={action} className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <div className="field">
        <label htmlFor="name">Naam van de website</label>
        <input id="name" name="name" type="text" required className="input" placeholder="Bijv. Meridian Studio" />
      </div>

      <div className="field">
        <label htmlFor="customerId">Klant</label>
        <select id="customerId" name="customerId" required value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="input">
          <option value="" disabled>
            Kies een klant…
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-[13px]">Design kit</legend>
        {available.length === 0 ? (
          <p className="text-muted !mb-0 text-[12.5px]">Er zijn nog geen design kits. De website gebruikt het standaardthema.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {available.map((k) => (
              <label key={k.id} className={choice}>
                <input type="radio" name="designKitId" value={k.id} checked={selected === k.id} onChange={() => setKitId(k.id)} className="mt-1" />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="truncate text-[13px] font-medium">{k.name}</span>
                  <KitSwatches theme={k.theme} />
                  <span className="text-muted truncate text-[11.5px]">
                    {k.customerId ? "Kit van de klant" : "Platformkit"} · {fontName(k.theme)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
        <p className="text-muted !mb-0 text-[12px]">Je kunt de kit later in de builder wisselen. Kits maak en bewerk je onder Design kits.</p>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-[13px]">Startpunt</legend>
        <div className="grid grid-cols-2 gap-3">
          {starters.map((s, i) => (
            <label key={s.id} className={choice}>
              <input type="radio" name="starter" value={s.id} defaultChecked={i === 0} className="mt-1" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium">{s.label}</span>
                <span className="text-muted text-[12px]">{s.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error ? (
        <div className="text-[12.5px] text-danger" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Website aanmaken…" : "Website aanmaken en bouwen"}
        </button>
        <Link href="/websites" className="btn btn-ghost">
          Annuleren
        </Link>
      </div>
    </form>
  );
}
