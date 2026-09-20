import { headers } from "next/headers";
import { auth, authPolicy } from "@/lib/auth";
import { requireStaff } from "@/lib/session";
import { Notice, Panel } from "../ui";
import { revokeOtherSessions, revokeSession } from "./actions";
import { describeIp, describeUserAgent } from "./user-agent";

const messages: Record<string, { tone: "ok" | "fout"; text: string }> = {
  "ok:sessie": { tone: "ok", text: "Sessie beëindigd." },
  "ok:anderen": { tone: "ok", text: "Je bent op alle andere apparaten uitgelogd." },
  "fout:huidig": { tone: "fout", text: "Dit is je huidige sessie. Uitloggen doe je via het menu." },
  "fout:onbekend": { tone: "fout", text: "Die sessie bestaat niet (meer)." },
};

const dateTime = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const facts: { label: string; value: string; note?: string }[] = [
  { label: "Inloggen", value: "E-mail en wachtwoord" },
  { label: "Minimale wachtwoordlengte", value: `${authPolicy.minPasswordLength} tekens` },
  { label: "Sessieduur", value: `${authPolicy.sessionDays} dagen`, note: "Wordt verlengd bij gebruik, maximaal één keer per dag." },
  { label: "Registreren", value: "Uitgeschakeld", note: "Accounts maak je aan met npm run create-user." },
];

export default async function BeveiligingPage({ searchParams }: { searchParams: Promise<{ ok?: string; fout?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const h = await headers();
  const [current, sessions] = await Promise.all([auth.api.getSession({ headers: h }), auth.api.listSessions({ headers: h })]);
  const currentToken = current?.session.token;
  const mine = [...sessions].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  const message = messages[sp.ok ? `ok:${sp.ok}` : sp.fout ? `fout:${sp.fout}` : ""];

  return (
    <div className="flex max-w-[860px] flex-col gap-[var(--space-6)]">
      {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}

      <Panel title="Jouw sessies" description="Apparaten waarop je nu bent ingelogd. Herken je er een niet, beëindig dan die sessie.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {mine.map((s) => {
            const isCurrent = s.token === currentToken;
            return (
              <li key={s.id} className="card elev-sm flex-row flex-wrap items-center justify-between !gap-3">
                <div className="flex flex-col gap-0.5">
                  <div className="text-[14px] font-medium">
                    {describeUserAgent(s.userAgent)}
                    {isCurrent ? <span className="tag tag-accent ml-2">dit apparaat</span> : null}
                  </div>
                  <div className="text-muted text-[12px]">
                    {describeIp(s.ipAddress) ? `${describeIp(s.ipAddress)} · ` : ""}laatst actief {dateTime.format(new Date(s.updatedAt))} · verloopt{" "}
                    {dateTime.format(new Date(s.expiresAt))}
                  </div>
                </div>
                {isCurrent ? null : (
                  <form action={revokeSession}>
                    <input type="hidden" name="token" value={s.token} />
                    <button type="submit" className="btn btn-secondary !py-1 text-[12.5px]">
                      Beëindigen
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
        {mine.length > 1 ? (
          <form action={revokeOtherSessions}>
            <button type="submit" className="btn btn-secondary">
              <i className="ph ph-sign-out" />
              Uitloggen op alle andere apparaten
            </button>
          </form>
        ) : null}
      </Panel>

      <Panel title="Inloggen" description="Zo staat het inlogbeleid nu ingesteld. Aanpassen gebeurt in de code (src/lib/auth.ts).">
        <dl className="m-0 grid grid-cols-[minmax(0,14rem)_1fr] gap-x-6 gap-y-2 text-[13.5px]">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-muted">{f.label}</dt>
              <dd className="m-0">
                {f.value}
                {f.note ? <span className="text-muted ml-2 text-[12px]">{f.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Gepland" description="Volgt zodra er een reden en een plek voor is.">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {[
            "Tweestapsverificatie",
            "Auditlog: wie heeft wat gewijzigd, met export",
            "IP-allowlist voor beheer",
            "API-tokens en scopes",
            "Back-ups en herstelpunten",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-[13.5px] text-text/80">
              <i className="ph ph-circle-dashed mt-[3px] text-[14px] text-text/45" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
