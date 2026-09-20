import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { NewSiteForm } from "./NewSiteForm";
import { requireStaff } from "@/lib/session";

export default async function NieuweWebsitePage() {
  await requireStaff(); // controle op de sessie; maakt de pagina ook dynamisch (live database-data)
  const rows = await db
    .select({ id: customers.id, name: customers.name })
    .from(customers)
    .where(eq(customers.status, "active"))
    .orderBy(asc(customers.name));

  return (
    <div className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <div>
        <h2 className="mb-1">Nieuwe website</h2>
        <div className="text-muted text-[12.5px]">
          Na het aanmaken open je de builder, waar je pagina&apos;s en secties opbouwt
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="text-[13px]">
          Er is nog geen actieve klant. Een website hoort bij een klant —{" "}
          <Link href="/klanten/nieuw" className="text-accent-200 underline">
            voeg eerst een klant toe
          </Link>
          .
        </div>
      ) : (
        <NewSiteForm customers={rows} />
      )}
    </div>
  );
}
