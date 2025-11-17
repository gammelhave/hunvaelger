// app/admin/profiles/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AdminProfilesPage() {
  // Kræv admin-login
  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect("/admin/login?next=/admin/profiles");
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    redirect("/");
  }

  const profiles = await prisma.profile.findMany();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Profiler</h1>
      <p className="text-sm text-gray-500 mb-6">
        Overblik over alle profiler i systemet. Du kan eksportere listen som CSV
        og gå til detaljer/sletning pr. profil.
      </p>

      <div className="mb-6">
        <Link
          href="/api/admin/export"
          className="inline-flex items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
        >
          Eksporter CSV
        </Link>
      </div>

      {profiles.length === 0 ? (
        <p>Der er endnu ingen profiler.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">Navn</th>
              <th className="border px-3 py-2 text-left">Alder</th>
              <th className="border px-3 py-2 text-left">Profil-ID</th>
              <th className="border px-3 py-2 text-left">Handling</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p: any) => (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">
                  {typeof p.age === "number" && p.age > 0 ? p.age : "-"}
                </td>
                <td className="border px-3 py-2 font-mono text-xs">{p.id}</td>
                <td className="border px-3 py-2">
                  <Link
                    href={`/admin/profiles/${p.id}`}
                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-xs font-medium hover:bg-gray-200"
                  >
                    Se detaljer / slet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
