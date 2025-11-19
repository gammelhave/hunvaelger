// app/admin/profiles/[id]/DeleteProfileButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProfileButton(props: {
  id: string;
  name?: string | null;
}) {
  const { id, name } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (loading) return;

    const sure = window.confirm(
      `Er du sikker på, at du vil slette profilen${name ? ` "${name}"` : ""}?`
    );
    if (!sure) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/profiles/${id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message || data?.error || `Fejl ved sletning: ${text}`
        );
      }

      // tilbage til liste
      router.push("/admin/profiles");
      router.refresh();
    } catch (err: any) {
      alert(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
    >
      {loading ? "Sletter…" : "Slet profil"}
    </button>
  );
}
