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
        <h1 className="text-[28px]">{customer.name}</h1>
        <form action={deleteWithId}>
          <button
            type="submit"
            className="btn btn-secondary !text-danger"
          >
            Klant verwijderen
          </button>
        </form>
      </div>
      <CustomerForm customer={customer} action={updateWithId} submitLabel="Wijzigingen opslaan" />
    </div>
  );
}
