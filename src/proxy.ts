import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Snelle, optimistische controle: alleen kijken of er een sessiecookie is. Dit is bewust niet de beveiliging zelf
// (de cookie kan verlopen of vals zijn); de echte controle staat in elke pagina en server-actie via src/lib/session.ts.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/login" || getSessionCookie(request)) return NextResponse.next();

  const url = new URL("/login", request.url);
  if (pathname !== "/") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Niet voor de auth-API zelf, Next-interne bestanden en statische bestanden uit public/ (alles met een extensie).
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\..*).*)"],
};
