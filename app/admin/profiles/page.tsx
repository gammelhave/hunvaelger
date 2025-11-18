"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminProfileRow = {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  email: string | null;
};

export default function AdminProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/profiles/list");

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Fejl fra /api/admin/profiles/list: ${res.status} – ${text}`
          );
        }

        const data = await res.json();
        if (!cancelled) {
          setProfiles(data.profiles ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Ukendt fejl");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Admin – profiler</h1>

      {loading && (
        <p className="text-sm text-gray-500">Henter profiler…</p>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Kunne ikke hente profiler.</p>
          <p className="mt-1">Teknisk detalje: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Der er {profiles.length} profiler i systemet.
          </p>

          {profiles.length === 0 ? (
            <p className="text-gray-500">Der er endnu ingen profiler.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Navn
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Alder
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Bio
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Detaljer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">
                        <Link
                          href={`/admin/profiles/${p.id}`}
                          className="text-pink-600 hover:underline"
                        >
                          {p.name || "–"}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{p.age ?? "–"}</td>
                      <td className="px-4 py-2">{p.email ?? "ingen email"}</td>
                      <td className="px-4 py-2 truncate max-w-xs">
                        {p.bio || "–"}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/admin/profiles/${p.id}`}
                          className="text-pink-600 hover:underline"
                        >
                          Åbn
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
