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
          <h1 className="text-2xl font-semibold text-slate-900">Klanten</h1>
          <p className="text-sm text-slate-500">{rows.length} klanten</p>
        </div>
        <Link
          href="/klanten/nieuw"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          + Nieuwe klant
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Nog geen klanten. Voeg de eerste toe met &ldquo;Nieuwe klant&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((customer) => (
            <Link
              key={customer.id}
              href={`/klanten/${customer.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{customer.name}</div>
                  <div className="text-sm text-slate-500">{customer.contactName}</div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    customer.tier === "pro"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tierLabel[customer.tier]}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div>{customer.email}</div>
                {customer.phone ? <div>{customer.phone}</div> : null}
              </div>
              {customer.status === "inactive" ? (
                <div className="mt-3 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
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
