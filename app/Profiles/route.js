// app/api/profiles/route.js
export const revalidate = 60; // cache max 60 sek

export async function GET() {
  const url = 'https://raw.githubusercontent.com/gammelhave/hunvaelger/main/app/p/data.json';
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Fetch failed', status: res.status }), { status: 502 });
    }
    const json = await res.json();
    return Response.json(json, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
