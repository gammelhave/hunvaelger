export const dynamic = "force-dynamic";

async function fetchProfiles() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/profiles`, { cache: "no-store" });
  const json = await res.json();
  return json.data || [];
}

export default async function ProfilesPage() {
  const list = await fetchProfiles();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profiler</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <a
            key={p.id}
            href={`/p/${p.id}`}
            className="rounded-2xl border p-4 hover:shadow"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm opacity-60">Ingen billede</span>
              )}
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-sm opacity-70">{p.age} • {p.city}</div>
              <div className="mt-2 text-sm">{p.bio}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
