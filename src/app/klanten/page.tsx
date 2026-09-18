import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";

const tierLabel = { bojob: "BOJOB", pro: "PRO" } as const;

export default async function KlantenPage() {
  const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px]">Klanten</h1>
          <p className="text-muted text-sm">{rows.length} {rows.length === 1 ? "klant" : "klanten"}</p>
        </div>
        <Link
          href="/klanten/nieuw"
          className="btn btn-primary"
        >
          + Nieuwe klant
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-muted rounded-lg border border-dashed border-neutral-700 p-10 text-center text-sm">
          Nog geen klanten. Voeg de eerste toe met &ldquo;Nieuwe klant&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((customer) => (
            <Link
              key={customer.id}
              href={`/klanten/${customer.id}`}
              className="card elev-sm block !p-4 text-text no-underline transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="card-title">{customer.name}</div>
                  <div className="text-muted text-[13px]">{customer.contactName}</div>
                </div>
                <span
                  className={`tag ${customer.tier === "pro" ? "tag-accent" : "tag-neutral"}`}
                >
                  {tierLabel[customer.tier]}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-[13px] text-text/80">
                <div>{customer.email}</div>
                {customer.phone ? <div>{customer.phone}</div> : null}
              </div>
              {customer.status === "inactive" ? (
                <div className="tag tag-outline mt-3 self-start">
                  Inactief
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
