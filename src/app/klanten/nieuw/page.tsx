import { CustomerForm } from "../CustomerForm";
import { createCustomer } from "../actions";

export default function NieuweKlantPage() {
  return (
    <div className="flex max-w-[720px] flex-col gap-[var(--space-6)]">
      <div>
        <h2 className="mb-1">Nieuwe klant</h2>
        <div className="text-muted text-[12.5px]">
          Zelfde formulier wordt gebruikt bij het bewerken van een bestaande klant
        </div>
      </div>
      <CustomerForm action={createCustomer} submitLabel="Klant toevoegen" />
    </div>
  );
}
