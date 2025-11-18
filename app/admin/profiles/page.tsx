"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminProfileListItem = {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  userEmail: string | null;
};

export default function AdminProfilesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<AdminProfileListItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/profiles/list");

        // Ikke logget ind som admin → send til login
        if (res.status === 401) {
          router.push("/admin/login?next=/admin/profiles");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Fejl fra /api/admin/profiles/list: ${res.status} – ${text}`
          );
        }

        const data = await res.json();
        if (cancelled) return;

        const items: AdminProfileListItem[] = (data.profiles ?? []).map(
          (p: any) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            bio: p.bio,
            userEmail: p.user?.email ?? null,
          })
        );

        setProfiles(items);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Ukendt fejl");
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
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>
        <p>Henter profiler…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Kunne ikke hente profiler.
          <div className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
            {error}
          </div>
        </div>
      </main>
    );
  }

  const count = profiles.length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>

      <p className="text-sm text-gray-600 mb-6">
        Der er <span className="font-semibold">{count}</span>{" "}
        {count === 1 ? "profil" : "profiler"} i systemet.
      </p>

      {count === 0 ? (
        <p>Der er endnu ingen profiler.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">Navn</th>
                <th className="px-4 py-2 font-medium">Alder</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Bio</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 hover:bg-pink-50/60"
                >
                  <td className="px-4 py-2">
                    <button
                      className="text-pink-600 hover:underline"
                      onClick={() => router.push(`/admin/profiles/${p.id}`)}
                    >
                      {p.name || "(uden navn)"}
                    </button>
                  </td>
                  <td className="px-4 py-2">{p.age ?? "–"}</td>
                  <td className="px-4 py-2">{p.userEmail ?? "–"}</td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {p.bio ?? "–"}
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
