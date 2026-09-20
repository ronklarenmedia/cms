import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { isPlatformHost, platformHosts } from "@/lib/site-hosts";

// Twee dingen, in deze volgorde:
//
// 1. Verkeer voor een openbare site (elke host die niet in PLATFORM_HOSTS staat) wordt intern doorgestuurd naar
//    /s/<host>/<pad>, waar de gepubliceerde site wordt opgebouwd. Zonder PLATFORM_HOSTS gebeurt dit nooit: dan is alles beheer.
// 2. Voor het beheer: een snelle, optimistische controle of er een sessiecookie is. Dit is bewust niet de beveiliging zelf
//    (de cookie kan verlopen of vals zijn); de echte controle staat in elke pagina en server-actie via src/lib/session.ts.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // /s/ is alleen intern. Een direct verzoek (bijv. localhost:3000/s/…) zou een site onder de beheerdomein tonen.
  if (pathname === "/s" || pathname.startsWith("/s/")) return new NextResponse(null, { status: 404 });

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const publicSite = platformHosts().length > 0 && !isPlatformHost(host);
  if (publicSite) {
    // Op een openbare site bestaat alleen de site zelf: geen inlog-API en geen beheerpagina's.
    if (pathname === "/api" || pathname.startsWith("/api/")) return new NextResponse(null, { status: 404 });
    return NextResponse.rewrite(new URL(`/s/${encodeURIComponent(host.toLowerCase())}${pathname === "/" ? "" : pathname}${search}`, request.url));
  }

  if (pathname === "/login" || pathname.startsWith("/api/auth") || getSessionCookie(request)) return NextResponse.next();

  const url = new URL("/login", request.url);
  if (pathname !== "/") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Niet voor Next-interne bestanden en statische bestanden uit public/ (alles met een extensie).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
