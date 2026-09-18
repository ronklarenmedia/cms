import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { CustomerForm } from "../CustomerForm";
import { deleteCustomer, updateCustomer } from "../actions";

export default async function KlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer] = await db.select().from(customers).where(eq(customers.id, id));

  if (!customer) {
    notFound();
  }

  const updateWithId = updateCustomer.bind(null, id);
  const deleteWithId = deleteCustomer.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{customer.name}</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Klant verwijderen
          </button>
        </form>
      </div>
      <CustomerForm customer={customer} action={updateWithId} submitLabel="Wijzigingen opslaan" />
    </div>
  );
}
