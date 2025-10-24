export const dynamic = "force-dynamic";

async function fetchProfile(id) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/profiles?id=${id}`, { cache: "no-store" });
  const json = await res.json();
  return json?.ok ? json.data : null;
}

export default async function ProfileDetail({ params }) {
  const p = await fetchProfile(params.id);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <a href="/p" className="text-sm underline opacity-70">← Tilbage</a>
        <h1 className="mt-4 text-2xl font-bold">Profil blev ikke fundet.</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <a href="/p" className="text-sm underline opacity-70">← Tilbage</a>

      <div className="rounded-2xl border p-4">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="sm:w-1/3">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo || "/avatars/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="sm:flex-1">
            <h1 className="text-3xl font-bold">{p.name}</h1>
            <p className="opacity-70">{p.age} • {p.city}</p>
            <p className="mt-3">{p.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(p.interests || []).map((t) => (
                <span key={t} className="rounded-full border px-3 py-1 text-sm">{t}</span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`/qr/${p.id}`}
                className="inline-block rounded-xl border px-4 py-2 hover:shadow transition"
              >
                Print QR til {p.name}
              </a>
              <a
                href={`/p/${p.id}?share=1`}
                className="inline-block rounded-xl border px-4 py-2 hover:shadow transition"
              >
                Del profil
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
