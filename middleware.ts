// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",
  "/admin/logout",
]);

// Hvis du har et internt admin-API-endpoint der kaldes fra middleware,
// så må det *ikke* selv være beskyttet af denne middleware.
// (ellers laver du rekursive requests i edge)
const ADMIN_HEALTH_ENDPOINT = "/api/admin/_am_i_admin";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Kun beskyt /admin/*
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  // Tillad altid login-/logout-siderne (ellers redirect-loop)
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  // Tillad også det interne admin-check API at køre frit
  if (pathname === ADMIN_HEALTH_ENDPOINT) return NextResponse.next();

  // 1) Kræv login
  const token = await getToken({ req });
  if (!token?.email) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Let admin-tjek: kald et simpelt server-endpoint der returnerer 200 for admins
  try {
    const res = await fetch(new URL(ADMIN_HEALTH_ENDPOINT, origin), {
      // videresend cookies så serveren kan læse sessionen
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });

    if (res.ok) return NextResponse.next();
  } catch {
    // Ignorér netværksfejl og falde igennem til redirect
  }

  // Ikke admin → send til forsiden (eller vis 403 side, hvis du har en)
  return NextResponse.redirect(new URL("/", origin));
}

// Matcher beskytter alle /admin/* – vi ekskluderer login/logout i koden ovenfor
export const config = {
  matcher: ["/admin/:path*"],
};
