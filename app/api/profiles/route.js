// app/api/profiles/route.js
export async function GET() {
  return new Response(JSON.stringify({ ok: true, health: 'profiles-api up' }), {
    headers: { 'content-type': 'application/json' },
  });
}
