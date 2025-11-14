"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Profile = {
  id: string;
  name?: string | null;
  age?: number | null;
  bio?: string | null;
  createdAt?: string;
};

export default function AdminProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/profiles/${id}`);
        if (!res.ok) {
          throw new Error("Kunne ikke hente profil");
        }
        const data = await res.json();
        if (!data?.ok || !data.profile) {
          throw new Error(data?.error ?? "Profil ikke fundet");
        }

        setProfile(data.profile);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Ukendt fejl");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleDelete() {
    if (!profile) return;
    const yes = window.confirm(
      `Er du sikker på, at du vil slette profilen "${profile.name ?? profile.id}"?\nDenne handling kan ikke fortrydes.`
    );
    if (!yes) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      const res = await fetch(`/api/admin/profiles/${profile.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke slette profilen");
      }

      // Tilbage til oversigten
      router.push("/admin/profiles");
    } catch (e: any) {
      console.error(e);
      setDeleteError(e?.message ?? "Ukendt fejl ved sletning");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Profil-detaljer</h1>
          <p className="text-sm text-gray-500">
            Se oplysninger om den valgte profil og slet den om nødvendigt.
          </p>
        </div>

        <Link
          href="/admin/profiles"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Tilbage til profiler
        </Link>
      </div>

      {loading && <p>Henter profil…</p>}

      {error && (
        <p className="text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4 text-sm">
          {error}
        </p>
      )}

      {!loading && !error && !profile && (
        <p className="text-gray-600">Profil ikke fundet.</p>
      )}

      {!loading && !error && profile && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4 bg-white">
            <h2 className="text-lg font-semibold mb-2">
              {profile.name ?? "(uden navn)"}{" "}
              <span className="text-sm text-gray-500">
                #{profile.id.slice(0, 8)}
              </span>
            </h2>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-600">Navn</dt>
                <dd>{profile.name ?? "-"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Alder</dt>
                <dd>{profile.age ?? "-"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Bio</dt>
                <dd className="whitespace-pre-line">
                  {profile.bio ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Oprettet</dt>
                <dd>
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleString("da-DK")
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>

          {deleteError && (
            <p className="text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 text-sm">
              {deleteError}
            </p>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 disabled:opacity-60"
          >
            {deleting ? "Sletter…" : "Slet profil"}
          </button>
        </div>
      )}
    </main>
  );
}
