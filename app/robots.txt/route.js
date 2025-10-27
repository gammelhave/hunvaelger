export async function GET() {
  const body = `User-agent: *
Disallow: /admin
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
