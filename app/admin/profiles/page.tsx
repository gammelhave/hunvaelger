// app/admin/profiles/page.tsx
import { prisma } from "@/lib/prisma";

export default async function AdminProfilesPage() {
  // Hent alle profiler
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Profiler</h1>

      {profiles.length === 0 ? (
        <p className="text-gray-600">Der er endnu ingen profiler.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-2">Navn</th>
              <th className="text-left p-2">Alder</th>
              <th className="text-left p-2">Bio</th>
              <th className="text-left p-2">Oprettet</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.age}</td>
                <td className="p-2">{p.bio}</td>
                <td className="p-2 text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleString("da-DK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
