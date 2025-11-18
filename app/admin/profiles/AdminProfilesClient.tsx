// app/admin/profiles/AdminProfilesClient.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminProfilesClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Hvis ikke logget ind → send til admin/login med redirect tilbage
  useEffect(() => {
    if (status === "unauthenticated") {
      const next = encodeURIComponent("/admin/profiles");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Admin – profiler</h1>
        <p>Tjekker login…</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p>Sender dig til admin login…</p>
      </main>
    );
  }

  const email = session?.user?.email ?? "ukendt";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>
      <p className="text-sm text-gray-600">
        Du er logget ind som{" "}
        <span className="font-medium">{email}</span>.
      </p>
      <p className="mt-4">
        Denne side er nu en client-komponent via AdminProfilesClient.
      </p>
    </main>
  );
}
