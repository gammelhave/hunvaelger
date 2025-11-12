import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  // Kræv login
  const token = await getToken({ req });
  if (!token?.email) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Billig tjek via lille API (marked som public route i Next)
  const res = await fetch(new URL("/api/admin/_am_i_admin", origin), {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });

  if (res.ok) return NextResponse.next();

  // Ikke admin → forsiden
  return NextResponse.redirect(new URL("/", origin));
}

export const config = {
  matcher: ["/admin/:path*"],
};
