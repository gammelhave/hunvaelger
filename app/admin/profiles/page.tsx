// app/admin/profiles/page.tsx
"use client";

import { useEffect, useState } from "react";

type ProfileDto = {
  id: string;
  name: string | null;
  age: number;
  bio: string | null;
  userEmail: string;
};

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/profiles/list", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Fejl fra /api/admin/profiles/list: ${res.status} ${res.statusText} – ${text}`
          );
        }

        const json = await res.json();
        // Forventer { ok: true, profiles: [...] }
        const list: ProfileDto[] = json.profiles ?? [];
        setProfiles(list);
      } catch (e: any) {
        console.error("Fejl ved hentning af profiler:", e);
        setError(e?.message ?? "Ukendt fejl");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>

      {loading && (
        <p className="text-gray-500">Henter profiler…</p>
      )}

      {!loading && error && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Kunne ikke hente profiler.</p>
          <p className="mt-1">
            Tekniske detaljer: <code>{error}</code>
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-gray-600 mb-6">
            Der er {profiles.length} profiler i systemet.
          </p>

          {profiles.length === 0 && (
            <p className="text-gray-500">Ingen profiler endnu.</p>
          )}

          {profiles.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Navn</th>
                  <th className="py-2">Alder</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Bio</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-pink-50">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.age}</td>
                    <td className="py-2">{p.userEmail}</td>
                    <td className="py-2 text-sm text-gray-700">
                      {p.bio ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}
