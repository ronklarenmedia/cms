import type { ReactNode } from "react";

/** Een blok binnen een tab: kop, korte uitleg en inhoud. */
export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h6 className="!mb-0 text-text/75">{title}</h6>
        {description ? <p className="text-muted !mb-0 text-[12.5px]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Notice({ tone, children }: { tone: "ok" | "fout" | "info"; children: ReactNode }) {
  const cls =
    tone === "ok"
      ? "border-success/40 bg-success/8 text-success"
      : tone === "fout"
        ? "border-danger/40 bg-danger/8 text-danger"
        : "border-divider bg-text/4 text-text/80";
  return (
    <div role={tone === "fout" ? "alert" : "status"} className={`rounded-md border px-3 py-2 text-[13px] ${cls}`}>
      {children}
    </div>
  );
}
