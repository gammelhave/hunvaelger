import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchProfiles() {
  // Brug headers til at bygge korrekt origin på serveren
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");

  const res = await fetch(`${origin}/api/profiles`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API /profiles fejl: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

export default async function ProfilesPage() {
  const list = await fetchProfiles();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Profiler</h1>
        <a href="/" className="text-sm underline opacity-70">
          Forside
        </a>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <a
            key={p.id}
            href={`/p/${p.id}`}
            className="rounded-2xl border p-4 hover:shadow transition"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo || "/avatars/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-sm opacity-70">
                {p.age} • {p.city}
              </div>
              <p className="mt-2 text-sm">{p.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(p.interests || []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
