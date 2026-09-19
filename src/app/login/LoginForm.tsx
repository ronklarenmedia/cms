"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

// Alleen paden binnen dit platform; voorkomt dat ?next= naar een externe site leidt.
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

export function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setPending(false);
      // Niet elke fout is een verkeerd wachtwoord; laat de andere oorzaken zien in plaats van ze te verbergen.
      setError(
        error.status === 401
          ? "E-mailadres of wachtwoord klopt niet."
          : error.status === 429
            ? "Te veel pogingen. Wacht even en probeer het opnieuw."
            : `Inloggen mislukt (${error.status || "geen verbinding"}${error.message ? `: ${error.message}` : ""}).`,
      );
      return;
    }
    router.replace(safeNext(next));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="field">
        <label htmlFor="email">E-mailadres</label>
        <input id="email" name="email" type="email" required autoComplete="username" autoFocus className="input" />
      </div>
      <div className="field">
        <label htmlFor="password">Wachtwoord</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {error ? (
        <div className="text-[12.5px] text-danger" role="alert">
          {error}
        </div>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Inloggen…" : "Inloggen"}
      </button>
    </form>
  );
}
