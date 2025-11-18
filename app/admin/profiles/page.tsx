// app/admin/profiles/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // vigtigt: dette er en admin-side, ikke statisk

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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin – Profiler</h1>

      <p className="text-gray-600 mb-6">
        Der er {profiles.length} profiler i systemet.
      </p>

      {profiles.length === 0 && (
        <p className="text-gray-500">Ingen profiler endnu.</p>
      )}

      {profiles.length > 0 && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Navn</th>
              <th className="py-2">Alder</th>
              <th className="py-2">Email</th>
              <th className="py-2">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b hover:bg-pink-50">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.age}</td>
                <td className="py-2">{p.user.email}</td>
                <td className="py-2">
                  <a
                    href={`/admin/profiles/${p.id}`}
                    className="text-pink-600 hover:underline"
                  >
                    Detaljer
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
