// middleware.ts
import { NextResponse } from "next/server";

// Ingen logik – bare lad alt passere
export function middleware() {
  return NextResponse.next();
}

// Tom matcher = middleware kører slet ikke
export const config = {
  matcher: [],
};
