"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/profiles");
        if (!res.ok) {
          throw new Error("Kunne ikke hente profiler");
        }

        const data = await res.json();

        // Forventet format: { ok: true, profiles: [...] }
        if (!data || !Array.isArray(data.profiles)) {
          throw new Error("Uventet svarformat fra /api/profiles");
        }

        setProfiles(data.profiles);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Ukendt fejl");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return profiles;

    return profiles.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const bio = (p.bio ?? "").toLowerCase();
      return name.includes(q) || bio.includes(q);
    });
  }, [profiles, search]);

  async function handleCreateTestProfile() {
    const yes = window.confirm("Opret en testprofil?");
    if (!yes) return;

    try {
      const res = await fetch("/api/admin/profiles/create-test", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Kunne ikke oprette testprofil");
        return;
      }

      // Reload siden for at hente nye profiler
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Teknisk fejl ved oprettelse af testprofil");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Profiler</h1>
          <p className="text-sm text-gray-500">
            Overblik over alle profiler i systemet. Du kan søge, oprette en
            testprofil og eksportere listen.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Søg i navn eller bio…"
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            onClick={handleCreateTestProfile}
            className="rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2"
          >
            Opret testprofil
          </button>

          <a
            href="/api/admin/export"
            className="rounded-md bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 flex items-center justify-center"
          >
            Eksporter CSV
          </a>
        </div>
      </div>

      {loading && <p>Henter profiler…</p>}

      {error && (
        <p className="text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4 text-sm">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-600">Der er endnu ingen profiler.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-2">Navn</th>
                <th className="text-left p-2">Alder</th>
                <th className="text-left p-2">Bio</th>
                <th className="text-left p-2 whitespace-nowrap">Oprettet</th>
                <th className="text-left p-2">Handling</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-2">{p.name ?? "-"}</td>
                  <td className="p-2">{p.age ?? "-"}</td>
                  <td className="p-2 max-w-xs truncate" title={p.bio ?? ""}>
                    {p.bio ?? "-"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-gray-500">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString("da-DK")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="text-pink-600 hover:underline"
                    >
                      Se detaljer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
