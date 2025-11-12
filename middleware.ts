import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",
  "/admin/logout",
]);

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Kun beskyt /admin/*
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  // Lad login/logout passere frit (ellers redirect-loop)
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  // 1) Kræv login
  const token = await getToken({ req });
  if (!token?.email) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Kræv admin-rolle
  const role = (token as any).role as string | undefined;
  if (role === "MASTER" || role === "ADMIN") {
    return NextResponse.next();
  }

  // Ikke admin → forsiden
  return NextResponse.redirect(new URL("/", origin));
}

export const config = {
  matcher: ["/admin/:path*"],
};
