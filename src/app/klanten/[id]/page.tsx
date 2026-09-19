import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isUuid } from "@/app/websites/ids";
import { db } from "@/db";
import { customers, sites } from "@/db/schema";
import { requireStaff } from "@/lib/session";
import { CustomerForm } from "../CustomerForm";
import { deleteCustomer, updateCustomer } from "../actions";

export default async function KlantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fout?: string }>;
}) {
  const user = await requireStaff();
  const [{ id }, { fout }] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();

  const [customer] = await db.select().from(customers).where(eq(customers.id, id));
  if (!customer) {
    notFound();
  }
  const customerSites = await db
    .select({ id: sites.id, name: sites.name, status: sites.status })
    .from(sites)
    .where(eq(sites.customerId, id))
    .orderBy(asc(sites.name));

  const updateWithId = updateCustomer.bind(null, id);
  const deleteWithId = deleteCustomer.bind(null, id);
  const isAdmin = user.role === "platform-admin";
  const hasSites = customerSites.length > 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[28px]">{customer.name}</h1>
        {isAdmin ? (
          <form action={deleteWithId}>
            <button
              type="submit"
              className="btn btn-secondary !text-danger"
              disabled={hasSites}
              title={hasSites ? "Verwijder of verplaats eerst de websites van deze klant" : undefined}
            >
              Klant verwijderen
            </button>
          </form>
        ) : null}
      </div>

      {fout === "sites" ? (
        <div className="mb-6 max-w-lg text-[13px] text-danger" role="alert">
          Deze klant heeft nog websites en kan niet worden verwijderd. Verwijder eerst die websites.
        </div>
      ) : null}

      <CustomerForm customer={customer} action={updateWithId} submitLabel="Wijzigingen opslaan" />

      <div className="mt-10 max-w-lg">
        <h4 className="mb-3">Websites ({customerSites.length})</h4>
        {hasSites ? (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {customerSites.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-md border border-divider px-3 py-2 text-[13px]">
                <Link href={`/websites/${s.id}`} className="min-w-0 flex-1 truncate">
                  {s.name}
                </Link>
                <span className={s.status === "live" ? "tag tag-accent" : "tag tag-neutral"}>
                  {s.status === "live" ? "Live" : "Concept"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted text-[13px]">Nog geen websites voor deze klant.</div>
        )}
      </div>
    </div>
  );
}
