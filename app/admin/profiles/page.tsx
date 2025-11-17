// app/admin/profiles/page.tsx
"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  name?: string | null;
  age?: number | null;
  bio?: string | null;
  createdAt?: string;
};

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProfiles() {
    try {
      const res = await fetch("/api/admin/profiles", { cache: "no-store" });
      if (!res.ok) {
        console.error("FEJL ved /api/admin/profiles:", res.status);
        return;
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error("FEJL ved hentning af profiler:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function handleExportCSV() {
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) {
        alert("Kunne ikke eksportere CSV");
        return;
      }

      const csv = await res.text();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "profiler.csv";
      link.click();
    } catch (err) {
      console.error("Fejl ved CSV eksport:", err);
      alert("Fejl ved CSV eksport");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-5">Profiler</h1>

      <p className="text-gray-600 mb-8">
        Overblik over alle profiler i systemet. Du kan eksportere listen som
        CSV og (senere) gå til detaljer/sletning pr. profil.
      </p>

      <div className="flex gap-3 mb-8">
        <button
          onClick={handleExportCSV}
          className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          Eksporter CSV
        </button>
      </div>

      {loading && <p className="text-gray-500">Indlæser profiler…</p>}

      {!loading && profiles.length === 0 && (
        <p>Der er endnu ingen profiler.</p>
      )}

      {!loading && profiles.length > 0 && (
        <div className="space-y-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="rounded border p-4 hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-lg">{p.name ?? "Uden navn"}</h2>
              <p className="text-gray-600 text-sm mb-1">
                Alder: {p.age ?? "ukendt"}
              </p>
              {p.bio && <p className="mt-1 text-gray-800">{p.bio}</p>}
              <p className="text-gray-400 text-xs mt-2">
                Oprettet:{" "}
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleString("da-DK")
                  : "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
