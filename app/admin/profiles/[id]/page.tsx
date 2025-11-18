// app/admin/profiles/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type AdminProfileDetail = {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  email: string | null;
};

export default function AdminProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profile, setProfile] = useState<AdminProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/profiles/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Fejl fra /api/admin/profiles/${id}: ${res.status} – ${txt}`
          );
        }

        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || "Ukendt fejl");
        }

        if (!cancelled) {
          setProfile(data.profile);
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
  }, [id]);

  async function handleDelete() {
    if (!profile) return;

    const sure = window.confirm(
      `Er du sikker på, at du vil slette profilen "${profile.name ?? ""}"?`
    );
    if (!sure) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/profiles/${profile.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(
          `Fejl fra DELETE /api/admin/profiles/${profile.id}: ${res.status} – ${txt}`
        );
      }

      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "Kunne ikke slette profil");
      }

      // Tilbage til liste
      router.push("/admin/profiles");
      router.refresh();
    } catch (err: any) {
      alert(err?.message ?? String(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/admin/profiles"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Tilbage til oversigten
        </Link>
      </div>

      {loading && <p>Henter profil…</p>}

      {error && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Kunne ikke hente profil.</p>
          <p className="mt-1">Teknisk detalje: {error}</p>
        </div>
      )}

      {!loading && !error && !profile && (
        <p>Profilen blev ikke fundet. (Måske er den allerede slettet.)</p>
      )}

      {!loading && !error && profile && (
        <>
          <h1 className="text-3xl font-semibold mb-4">
            Admin – profil: {profile.name || "(uden navn)"}
          </h1>

          <dl className="mb-8 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-gray-600">Navn</dt>
              <dd>{profile.name || <span className="text-gray-400">ingen</span>}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-600">Alder</dt>
              <dd>
                {profile.age != null ? profile.age : <span className="text-gray-400">ingen</span>}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-600">Email</dt>
              <dd>
                {profile.email || <span className="text-gray-400">ingen</span>}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-600">Bio</dt>
              <dd>
                {profile.bio || <span className="text-gray-400">ingen</span>}
              </dd>
            </div>
          </dl>

          <div className="flex gap-3">
            {/* Rediger-knap kan vi lave i en senere del */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Sletter…" : "Slet profil"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
