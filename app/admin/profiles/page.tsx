// app/admin/profiles/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  // Hent alle profiler + brugerens email
  const profiles = await prisma.profile.findMany({
    include: {
      user: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Admin – profiler</h1>
      <p className="text-sm text-gray-600 mb-6">
        Der er {profiles.length} profiler i systemet.
      </p>

      {profiles.length === 0 ? (
        <p className="text-gray-500">Der er endnu ingen profiler.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Navn
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Alder
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Bio
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Detaljer
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="text-pink-600 hover:underline"
                    >
                      {p.name || "–"}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{p.age ?? "–"}</td>
                  <td className="px-4 py-2">
                    {p.user?.email ?? "ingen email"}
                  </td>
                  <td className="px-4 py-2 truncate max-w-xs">
                    {p.bio || "–"}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="text-pink-600 hover:underline"
                    >
                      Åbn
                    </Link>
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
