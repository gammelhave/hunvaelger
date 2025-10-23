// middleware.js
import { NextResponse } from 'next/server';

// Hvilke stier skal beskyttes
const PROTECTED_PREFIXES = ['/admin'];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Kun beskyt de præcise prefixes
  const needsAuth = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // Forvent Basic Auth "Authorization: Basic base64(user:pass)"
  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return unauthorized();
  }

  const [user, pass] = atob(encoded).split(':');

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return NextResponse.next();
  }

  return unauthorized();
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="HunVælger Admin"' }
  });
}

export const config = {
  // Kør middleware for alle routes (vi filtrerer selv inde i koden)
  matcher: ['/((?!_next/|api/|favicon.ico|qr|p|hello).*)', '/admin/:path*']
};
