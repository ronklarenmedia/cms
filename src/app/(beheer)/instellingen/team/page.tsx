import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, user, userRoles, type UserRole } from "@/db/schema";
import { requireStaff } from "@/lib/session";
import { Notice, Panel } from "../ui";
import { updateUserRole } from "./actions";

const roleLabel: Record<UserRole, string> = {
  "platform-admin": "Platform-admin",
  medewerker: "Medewerker",
  klantgebruiker: "Klantgebruiker",
};

const messages: Record<string, { tone: "ok" | "fout"; text: string }> = {
  "ok:rol": { tone: "ok", text: "Rol bijgewerkt." },
  "fout:rechten": { tone: "fout", text: "Alleen een platform-admin mag rollen wijzigen." },
  "fout:rol": { tone: "fout", text: "Dat is geen geldige rol." },
  "fout:zelf": { tone: "fout", text: "Je kunt je eigen rol niet wijzigen. Vraag een andere platform-admin." },
  "fout:onbekend": { tone: "fout", text: "Deze gebruiker bestaat niet (meer)." },
  "fout:klant": { tone: "fout", text: "Kies bij een klantgebruiker de klant waar deze bij hoort." },
};

const dateFormat = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" });

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ ok?: string; fout?: string }> }) {
  const me = await requireStaff();
  const sp = await searchParams;
  const canEdit = me.role === "platform-admin";

  const [users, allCustomers] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        customerId: user.customerId,
        customerName: customers.name,
        createdAt: user.createdAt,
      })
      .from(user)
      .leftJoin(customers, eq(user.customerId, customers.id))
      .orderBy(asc(user.name)),
    db.select({ id: customers.id, name: customers.name }).from(customers).orderBy(asc(customers.name)),
  ]);

  const message = messages[sp.ok ? `ok:${sp.ok}` : sp.fout ? `fout:${sp.fout}` : ""];

  return (
    <div className="flex max-w-[980px] flex-col gap-[var(--space-6)]">
      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
      {!canEdit ? <Notice tone="info">Alleen een platform-admin kan rollen wijzigen.</Notice> : null}

      <Panel
        title={`Gebruikers (${users.length})`}
        description="Platform-admin en medewerker beheren het platform. Een klantgebruiker hoort bij één klant en heeft (nog) geen toegang tot het beheerdeel."
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Gebruiker</th>
                <th>Rol</th>
                <th>Klant</th>
                <th>Sinds</th>
                {canEdit ? <th aria-label="Acties" /> : null}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === me.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="font-medium">
                        {u.name}
                        {isMe ? <span className="tag tag-outline ml-2">jij</span> : null}
                      </div>
                      <div className="text-muted text-[12px]">{u.email}</div>
                    </td>
                    {canEdit && !isMe ? (
                      <td colSpan={2}>
                        <form id={`rol-${u.id}`} action={updateUserRole} className="flex flex-wrap items-center gap-2">
                          <input type="hidden" name="userId" value={u.id} />
                          <select name="role" defaultValue={u.role} className="input !w-auto" aria-label={`Rol van ${u.name}`}>
                            {userRoles.map((r) => (
                              <option key={r} value={r}>
                                {roleLabel[r]}
                              </option>
                            ))}
                          </select>
                          <select
                            name="customerId"
                            defaultValue={u.customerId ?? ""}
                            className="input !w-auto"
                            aria-label={`Klant van ${u.name} (alleen voor een klantgebruiker)`}
                          >
                            <option value="">— geen klant —</option>
                            {allCustomers.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td>
                          <span className={`tag ${u.role === "platform-admin" ? "tag-accent" : "tag-neutral"}`}>{roleLabel[u.role]}</span>
                        </td>
                        <td className="text-[13px]">{u.customerName ?? <span className="text-muted">—</span>}</td>
                      </>
                    )}
                    <td className="text-muted whitespace-nowrap text-[12.5px]">{dateFormat.format(u.createdAt)}</td>
                    {canEdit ? (
                      <td className="text-right">
                        {isMe ? null : (
                          <button type="submit" form={`rol-${u.id}`} className="btn btn-secondary !py-1 text-[12.5px]">
                            Opslaan
                          </button>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Nieuwe gebruiker" description="Accounts worden bewust aangemaakt, zodat niemand zichzelf toegang kan geven.">
        <p className="text-[13px] text-text/80">
          Draai <code>npm run create-user</code> in een terminal en geef het e-mailadres van de nieuwe gebruiker op. Daarna kun je hier de rol
          aanpassen. Aanmaken vanuit de app volgt met een uitnodigingsflow.
        </p>
      </Panel>
    </div>
  );
}
