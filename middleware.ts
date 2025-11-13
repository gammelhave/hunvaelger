// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";

// Paths der IKKE må beskyttes af admin-krav
const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",                 // admin login-side
]);

// Generelt offentlige ting
function isPublic(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (!p.startsWith(ADMIN_PREFIX)) return true;                    // alt udenfor /admin er offentligt
  if (PUBLIC_ADMIN_PATHS.has(p)) return true;                      // whitelist
  if (p.startsWith("/_next")) return true;                         // Next assets
  if (p === "/favicon.ico" || p === "/robots.txt") return true;
  // offentlige auth- og helper-endpoints
  if (p.startsWith("/api/auth")) return true;
  if (p === "/api/admin/_am_i_admin") return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Offentlige ruter kører bare videre
  if (isPublic(req)) return NextResponse.next();

  // Herfra: kun /admin/* der IKKE er whitelisted

  // 1) Kræv login
  const token = await getToken({ req });
  if (!token?.email) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Billigt admin-tjek (kaldes som logged-in med cookies)
  const res = await fetch(new URL("/api/admin/_am_i_admin", origin), {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });

  if (res.ok) return NextResponse.next();

  // 3) Ikke admin → forsiden
  return NextResponse.redirect(new URL("/", origin));
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"], // lad middleware fange admin og API-calls
};
