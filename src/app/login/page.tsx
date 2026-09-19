import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LoginForm } from "./LoginForm";
import { SignOutButton } from "./SignOutButton";

export const metadata = { title: "Inloggen — Ron Klaren Media" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [user, { next }] = await Promise.all([getSessionUser(), searchParams]);
  // Personeel is al ingelogd: door naar het platform.
  if (user && user.role !== "klantgebruiker") redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");

  return (
    <main className="grid min-h-screen place-items-center bg-bg p-6">
      <div className="flex w-full max-w-[380px] flex-col gap-6 rounded-lg bg-surface p-8 shadow-[var(--shadow-md)]">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-full" />
          <div>
            <h1 className="!m-0 text-[18px]">Ron Klaren Media</h1>
            <div className="text-muted text-[12px]">Platform</div>
          </div>
        </div>
        {user ? (
          <div className="flex flex-col gap-4">
            <p className="!m-0 text-[13px]">
              Het account <strong>{user.email}</strong> heeft nog geen toegang tot het beheerplatform.
            </p>
            <SignOutButton />
          </div>
        ) : (
          <LoginForm next={next ?? null} />
        )}
      </div>
    </main>
  );
}
