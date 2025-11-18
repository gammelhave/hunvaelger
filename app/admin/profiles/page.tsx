// app/admin/profiles/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AdminProfilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Når vi ved at vi IKKE er logget ind → send til admin-login
    if (status === "unauthenticated") {
      const next = encodeURIComponent("/admin/profiles");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [status, router, searchParams]);

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Admin – profiler</h1>
        <p>Tjekker login…</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    // Vi er på vej til login – vis bare tomt/loader
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
        Du er logget ind som <span className="font-medium">{email}</span>.
      </p>
      <p className="mt-4">
        Dette er den simple admin-profilside. Nu ved vi at login-tjekket virker
        uden at siden hænger. Næste skridt er at vise rigtige profiler og CSV-export.
      </p>
    </main>
  );
}
