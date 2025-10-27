export async function GET() {
  const body = `User-agent: *
Disallow: /admin
Disallow: /api
Allow: /

Sitemap: https://hunvaelger.vercel.app/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
