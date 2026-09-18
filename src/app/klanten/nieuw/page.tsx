import { CustomerForm } from "../CustomerForm";
import { createCustomer } from "../actions";

export default function NieuweKlantPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Nieuwe klant</h1>
      <CustomerForm action={createCustomer} submitLabel="Klant toevoegen" />
    </div>
  );
}
