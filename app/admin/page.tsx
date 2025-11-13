// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AdminPage() {
  // 1) Kræv login
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    // ikke logget ind → send til admin-login
    redirect("/admin/login?callbackUrl=/admin");
  }

  // 2) Kun den ene admin-bruger må se siden
  if (email !== "admin@hunvaelger.dk") {
    redirect("/");
  }

  // 3) Server-renderet dashboard
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Admin dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Logget ind som <span className="font-medium">{email}</span> (ADMIN)
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Profiler</h2>
          <p className="text-sm text-gray-600 mb-3">
            Opret, redigér eller slet brugerprofiler.
          </p>
          <Link
            href="/admin/profiles"
            className="inline-block rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Gå til profiler
          </Link>
        </section>

        <section className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Admin-brugere</h2>
          <p className="text-sm text-gray-600 mb-3">
            (Senere) administration af flere admin-brugere.
          </p>
          <Link
            href="/admin/admins"
            className="inline-block rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Administrér admins
          </Link>
        </section>

        <section className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Upload & billeder</h2>
          <p className="text-sm text-gray-600 mb-3">
            Overblik over uploadede profilbilleder (kommer senere).
          </p>
          <Link
            href="/admin/uploads"
            className="inline-block rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Se uploads
          </Link>
        </section>

        <section className="rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Log ud</h2>
          <p className="text-sm text-gray-600 mb-3">
            Afslut din session og gå tilbage til forsiden.
          </p>
          <Link
            href="/api/auth/signout?callbackUrl=/"
            className="inline-block rounded bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
          >
            Log ud
          </Link>
        </section>
      </div>
    </main>
  );
}
