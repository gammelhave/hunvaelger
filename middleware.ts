import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Beskyt /admin og alle admin-/profiles-operationer
  const protect = ["/admin", "/api/profiles/clear", "/api/profiles/", "/api/admin/"]
    .some((p) => pathname.startsWith(p))
  if (!protect) return NextResponse.next()

  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASS
  if (!user || !pass) return NextResponse.next()

  const auth = req.headers.get("authorization") || ""
  const [scheme, encoded] = auth.split(" ")
  if (scheme !== "Basic" || !encoded) return unauthorized()

  const decoded = Buffer.from(encoded, "base64").toString()
  const [u, p] = decoded.split(":")
  if (u === user && p === pass) return NextResponse.next()

  return unauthorized()
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  })
}

// Matcher nu også /api/admin/*
export const config = {
  matcher: ["/admin/:path*", "/api/profiles/:path*", "/api/admin/:path*"],
}
