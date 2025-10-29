import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECT_PREFIX = "/admin"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith(PROTECT_PREFIX)) return NextResponse.next()

  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASS
  if (!user || !pass) {
    // hvis ikke sat, giv adgang (eller returner 500)
    return NextResponse.next()
  }

  const auth = req.headers.get("authorization") || ""
  const [scheme, encoded] = auth.split(" ")
  if (scheme !== "Basic" || !encoded) {
    return unauthorized()
  }

  const decoded = Buffer.from(encoded, "base64").toString()
  const [u, p] = decoded.split(":")
  if (u === user && p === pass) {
    return NextResponse.next()
  }

  return unauthorized()
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  })
}

export const config = {
  matcher: ["/admin/:path*"],
}
