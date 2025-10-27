import { headers } from "next/headers";
import Image from "next/image";
import { useMemo, useState } from "react";

export const dynamic = "force-dynamic";

async function fetchProfiles() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
  const res = await fetch(`${origin}/api/profiles`, { cache: "no-store" });
  if (!res.ok) throw new Error("API error");
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

      {/* Client-side komponent til søgning/filter */}
      <FilterBox initial={list} />
    </main>
  );
}

/* ---------------- Client component for filter ---------------- */
"use client";

function FilterBox({ initial }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return initial;
    return initial.filter((p) => {
      const hay = [
        p.name,
        p.city,
        ...(p.interests || []),
        String(p.age ?? ""),
      ].join(" ").toLowerCase();
      return hay.includes(term);
    });
  }, [q, initial]);

  return (
    <>
      <div className="rounded-2xl border bg-white/60 p-4 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Søg på navn, by, interesse…"
          className="w-full rounded-xl border px-4 py-2"
        />
        <p className="mt-2 text-xs opacity-60">
          Viser {filtered.length} af {initial.length} profiler
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {filtered.map((p) => (
          <a
            key={p.id}
            href={`/p/${encodeURIComponent(p.id)}`}
            className="rounded-2xl border p-4 hover:shadow transition"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={p.photo || "/avatars/placeholder.jpg"}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-sm opacity-70">
                {p.age} • {p.city}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
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
    </>
  );
}
