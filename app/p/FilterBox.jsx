"use client";

import { useMemo, useState } from "react";

export default function FilterBox({ initial }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return initial;
    return initial.filter((p) => {
      const hay = [
        p.name,
        p.city,
        ...(p.interests || []),
        String(p.age ?? "")
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
          <a key={p.id} href={`/p/${encodeURIComponent(p.id)}`} className="rounded-2xl border p-4 hover:shadow transition">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photo || "/avatars/placeholder.jpg"} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-sm opacity-70">{p.age} • {p.city}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(p.interests || []).slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-xs">{t}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
