// app/admin/profiles/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProfilesPage() {
  // Kræv admin-login
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect("/admin/login?next=/admin/profiles");
  }

  // Hent alle profiler direkte fra databasen
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const count = profiles.length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>

      <p className="text-sm text-gray-600 mb-6">
        Der er <span className="font-semibold">{count}</span>{" "}
        {count === 1 ? "profil" : "profiler"} i systemet.
      </p>

      {count === 0 ? (
        <p>Der er endnu ingen profiler.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium">Navn</th>
                <th className="px-4 py-2 font-medium">Alder</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Bio</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 hover:bg-pink-50/60"
                >
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="text-pink-600 hover:underline"
                    >
                      {p.name || "(uden navn)"}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{p.age ?? "–"}</td>
                  <td className="px-4 py-2">{p.user?.email ?? "–"}</td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {p.bio ?? "–"}
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
