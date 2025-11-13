// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Kør kun logik på /admin-ruter
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Admin-login siden skal ALTID være åben
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Tjek login via NextAuth JWT
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Hvis ikke logget ind → send til admin-login
  if (!token || !token.email) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kun admin-mailen må se /admin-området
  if (token.email !== "admin@hunvaelger.dk") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Alt ok → fortsæt
  return NextResponse.next();
}

// Matcher kun /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
