import Link from "next/link";
import type { Customer } from "@/db/schema";

export function CustomerForm({
  customer,
  action,
  submitLabel,
}: {
  customer?: Customer;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-5">
      <div className="field">
        <label htmlFor="name">
          Bedrijfsnaam
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={customer?.name}
          className="input"
        />
      </div>
      <div className="field">
        <label htmlFor="contactName">
          Contactpersoon
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          required
          defaultValue={customer?.contactName}
          className="input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={customer?.email}
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="phone">
            Telefoon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={customer?.phone ?? ""}
            className="input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label htmlFor="tier">
            Plan
          </label>
          <select
            id="tier"
            name="tier"
            defaultValue={customer?.tier ?? "bojob"}
            className="input"
          >
            <option value="bojob">BOJOB</option>
            <option value="pro">PRO</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={customer?.status ?? "active"}
            className="input"
          >
            <option value="active">Actief</option>
            <option value="inactive">Inactief</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {submitLabel}
        </button>
        <Link href="/klanten" className="btn btn-ghost">
          Annuleren
        </Link>
      </div>
    </form>
  );
}
