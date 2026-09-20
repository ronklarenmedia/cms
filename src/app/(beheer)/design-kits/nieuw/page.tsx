import { asc } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { listKitSources } from "@/lib/kits";
import { requireStaff } from "@/lib/session";
import { isUuid } from "../../websites/ids";
import { NewKitForm } from "./NewKitForm";

export default async function NewKitPage({ searchParams }: { searchParams: Promise<{ kopie?: string }> }) {
  await requireStaff();
  const { kopie } = await searchParams;
  const [clientRows, sources] = await Promise.all([db.select({ id: customers.id, name: customers.name }).from(customers).orderBy(asc(customers.name)), listKitSources()]);
  const copy = kopie && isUuid(kopie) ? sources.find((s) => s.id === kopie) : undefined;

  return (
    <div className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <div>
        <h2 className="!mb-1">Nieuwe design kit</h2>
        <div className="text-muted text-[12.5px]">Je stelt de tokens daarna in de editor in.</div>
      </div>
      <NewKitForm
        customers={clientRows}
        sources={sources.map((s) => ({ id: s.id, name: s.name, platform: s.customerId === null }))}
        defaultBase={copy?.id ?? "leeg"}
        defaultName={copy ? `${copy.name} (kopie)` : ""}
      />
    </div>
  );
}
