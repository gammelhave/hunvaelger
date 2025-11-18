// app/admin/profiles/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminProfileRow = {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  user?: {
    email: string | null;
  };
  email?: string | null;
};

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/profiles/list", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Fejl fra /api/admin/profiles/list: ${res.status} – ${txt}`
          );
        }

        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || "Ukendt fejl");
        }

        if (!cancelled) {
          setProfiles(data.profiles ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin – profiler</h1>

      {loading && <p>Henter profiler…</p>}

      {error && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Kunne ikke hente profiler.</p>
          <p className="mt-1">Teknisk detalje: {error}</p>
        </div>
      )}

      {!loading && !error && profiles.length === 0 && (
        <p>Der er endnu ingen profiler i systemet.</p>
      )}

      {!loading && !error && profiles.length > 0 && (
        <>
          <p className="mb-4 text-sm text-gray-600">
            Der er {profiles.length} profil
            {profiles.length === 1 ? "" : "er"} i systemet.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-3 py-2 text-left">Navn</th>
                  <th className="border px-3 py-2 text-left">Alder</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Bio</th>
                  <th className="border px-3 py-2 text-left">Detaljer</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const email = p.user?.email ?? p.email ?? "";
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        <Link
                          href={`/admin/profiles/${p.id}`}
                          className="text-pink-600 hover:underline"
                        >
                          {p.name || "(uden navn)"}
                        </Link>
                      </td>
                      <td className="border px-3 py-2">
                        {p.age != null ? p.age : "—"}
                      </td>
                      <td className="border px-3 py-2">
                        {email || <span className="text-gray-400">ingen</span>}
                      </td>
                      <td className="border px-3 py-2 max-w-xs truncate">
                        {p.bio || <span className="text-gray-400">ingen</span>}
                      </td>
                      <td className="border px-3 py-2">
                        <Link
                          href={`/admin/profiles/${p.id}`}
                          className="text-pink-600 hover:underline"
                        >
                          Åbn
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
