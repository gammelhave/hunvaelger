// app/admin/profiles/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic"; // sørger for at den ikke bliver statisk

export default async function AdminProfilesPage() {
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
        Der er {profiles.length} profil
        {profiles.length === 1 ? "" : "er"} i systemet.
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
                <tr key={p.id} className="border-t hover:bg-gray-50">
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
                    {p.user?.email ?? <span className="text-gray-400">ingen</span>}
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {p.bio || <span className="text-gray-400">ingen</span>}
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
