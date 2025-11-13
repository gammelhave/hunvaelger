// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Gør ingenting – alt passerer
  return NextResponse.next();
}

// Ingen matcher – middleware er i praksis slået fra
export const config = {
  matcher: [],
};
