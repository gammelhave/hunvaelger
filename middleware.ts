import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Middleware er midlertidigt slået fra
  return NextResponse.next();
}

// Ingen matcher = ingen ruter bruger middleware
export const config = {
  matcher: [],
};
