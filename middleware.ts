import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/min-profil/:path*", "/admin/:path*"], // admin rutes til kvindens “min profil”
};

export function middleware(req: NextRequest) {
  // simpel check: vi lader server-route selv lave den endelige rolle-kontrol.
  // Her kan vi bare sikre at brugeren er logget ind; NextAuth tilføjer session cookie.
  const hasSession = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");
  if (!hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
