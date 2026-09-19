"use client";

import Link from "next/link";
import { useActionState } from "react";
import { defaultTheme } from "@/blocks/theme";
import { createSite } from "../actions";
import { starters, themeOptions } from "../sections";

const choice =
  "flex cursor-pointer gap-3 rounded-md border border-divider p-3 has-[:checked]:border-accent has-[:checked]:bg-accent/8";

export function NewSiteForm({ customers }: { customers: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createSite, undefined);

  return (
    <form action={action} className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <div className="field">
        <label htmlFor="name">Naam van de website</label>
        <input id="name" name="name" type="text" required className="input" placeholder="Bijv. Meridian Studio" />
      </div>

      <div className="field">
        <label htmlFor="customerId">Klant</label>
        <select id="customerId" name="customerId" required defaultValue="" className="input">
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
        <legend className="mb-1 text-[13px]">Thema</legend>
        <div className="grid grid-cols-2 gap-3">
          {themeOptions.map((t, i) => {
            const merged = { ...defaultTheme, ...t.theme };
            return (
              <label key={t.id} className={choice}>
                <input type="radio" name="theme" value={t.id} defaultChecked={i === 0} className="mt-1" />
                <span className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium">{t.label}</span>
                  <span className="flex gap-1">
                    {[merged.colorPrimary, merged.colorSecondary, merged.colorAccent, merged.colorText, merged.colorBgPrimaryLight].map(
                      (c) => (
                        <span key={c} className="size-5 rounded-sm shadow-[var(--shadow-sm)]" style={{ background: String(c) }} />
                      ),
                    )}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
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
