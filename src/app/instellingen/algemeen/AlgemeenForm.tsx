"use client";

import { useActionState } from "react";
import { LANGUAGES, TIMEZONES, type PlatformSettings } from "@/lib/platform-settings-schema";
import { Notice, Panel } from "../ui";
import { savePlatformSettings } from "./actions";

type FieldProps = {
  name: keyof PlatformSettings;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ name, label, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? (
        <p id={`${name}-fout`} className="!mb-0 mt-1 text-[12px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted !mb-0 mt-1 text-[11.5px]">{hint}</p>
      ) : null}
    </div>
  );
}

export function AlgemeenForm({ settings, canEdit }: { settings: PlatformSettings; canEdit: boolean }) {
  const [state, action, pending] = useActionState(savePlatformSettings, undefined);
  const v = state?.values ?? settings;
  const err = state?.fieldErrors ?? {};
  const input = (name: keyof PlatformSettings) => ({
    id: name,
    name,
    defaultValue: v[name],
    disabled: !canEdit,
    className: "input",
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${name}-fout` : undefined,
  });

  return (
    <form action={action} className="flex max-w-[860px] flex-col gap-[var(--space-6)]">
      {!canEdit ? <Notice tone="info">Alleen een platform-admin kan deze instellingen wijzigen.</Notice> : null}

      <Panel title="Organisatie">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field name="platformName" label="Naam platform" hint="Staat in het menu en in de titel van het tabblad." error={err.platformName}>
            <input {...input("platformName")} type="text" required maxLength={120} />
          </Field>
          <Field name="adminDomain" label="Beheerdomein" hint="Nog niet in gebruik; volgt met het serveren van sites." error={err.adminDomain}>
            <input {...input("adminDomain")} type="text" placeholder="beheer.voorbeeld.nl" maxLength={255} />
          </Field>
          <Field name="language" label="Taal" hint="Alleen Nederlands is beschikbaar." error={err.language}>
            <select {...input("language")}>
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field name="timezone" label="Tijdzone" hint="Nog niet in gebruik; voor tijden in rapporten en e-mails." error={err.timezone}>
            <select {...input("timezone")}>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Panel>

      <Panel title="Contact & afzender" description="Wordt gebruikt voor e-mails en facturen zodra die er zijn; nu alleen opgeslagen.">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <Field name="supportEmail" label="Supportadres" error={err.supportEmail}>
            <input {...input("supportEmail")} type="email" placeholder="support@voorbeeld.nl" maxLength={255} />
          </Field>
          <Field name="senderName" label="Afzendernaam e-mail" error={err.senderName}>
            <input {...input("senderName")} type="text" maxLength={120} />
          </Field>
          <Field name="phone" label="Telefoon" error={err.phone}>
            <input {...input("phone")} type="tel" placeholder="+31 6 12345678" maxLength={25} />
          </Field>
          <Field name="kvk" label="KvK" error={err.kvk}>
            <input {...input("kvk")} type="text" inputMode="numeric" placeholder="12345678" maxLength={8} />
          </Field>
        </div>
      </Panel>

      {state?.error ? <Notice tone="fout">{state.error}</Notice> : null}
      {state?.saved ? <Notice tone="ok">Opgeslagen.</Notice> : null}

      <div>
        <button type="submit" disabled={!canEdit || pending} className="btn btn-primary">
          <i className="ph ph-check" />
          {pending ? "Opslaan…" : "Wijzigingen opslaan"}
        </button>
      </div>
    </form>
  );
}
