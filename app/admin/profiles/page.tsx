// app/admin/profiles/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminProfilesPage() {
  type Profile = {
    id: string;
    name: string;
    age: number | null;
    bio: string | null;
    createdAt: string;
  };

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Hent profiler fra API
  async function loadProfiles() {
    try {
      const res = await fetch("/api/admin/profiles", { cache: "no-store" });
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

  // Opret testprofil
  async function handleCreateTestProfile() {
    const yes = window.confirm("Opret en testprofil?");
    if (!yes) return;

    try {
      const res = await fetch("/api/admin/profiles/create-test", {
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "CREATE-TEST ERROR:",
          res.status,
          text
        );
        alert("Kunne ikke oprette testprofil");
        return;
      }

      window.location.reload(); // hent igen
    } catch (err) {
      console.error("CREATE-TEST FETCH ERROR:", err);
      alert("Teknisk fejl ved oprettelse af testprofil");
    }
  }

  // Eksporter CSV
  async function handleExportCSV() {
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) {
        alert("Kunne ikke eksportere CSV");
        return;
      }

      const csv = await res.text();

      // download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "profiler.csv";
      link.click();
    } catch (err) {
      alert("Fejl ved CSV eksport");
      console.error(err);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-5">Profiler</h1>

      <p className="text-gray-600 mb-8">
        Overblik over alle profiler i systemet. Du kan søge, oprette en testprofil
        og eksportere listen som CSV.
      </p>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleCreateTestProfile}
          className="rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
        >
          Opret testprofil
        </button>

        <button
          onClick={handleExportCSV}
          className="rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          Eksporter CSV
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Indlæser profiler…</p>}

      {/* Ingen profiler */}
      {!loading && profiles.length === 0 && (
        <p>Der er endnu ingen profiler.</p>
      )}

      {/* Liste over profiler */}
      <div className="space-y-4">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="rounded border p-4 hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p className="text-gray-600 text-sm">
              Alder: {p.age ?? "ukendt"} · Oprettet:{" "}
              {new Date(p.createdAt).toLocaleDateString()}
            </p>
            {p.bio && <p className="mt-2 text-gray-800">{p.bio}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
