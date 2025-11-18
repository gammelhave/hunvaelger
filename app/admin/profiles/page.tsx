// app/admin/profiles/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  // Hent alle profiler fra databasen (seneste først)
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>
      <p className="text-sm text-gray-600 mb-6">
        Simpel admin-oversigt over profiler. (Lige nu uden login-tjek, det
        bygger vi på senere.)
      </p>

      {profiles.length === 0 ? (
        <p>Der er endnu ingen profiler.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">Navn</th>
              <th className="border px-3 py-2 text-left">Alder</th>
              <th className="border px-3 py-2 text-left">Email (bruger)</th>
              <th className="border px-3 py-2 text-left">Oprettet</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p: any) => (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.name ?? "Uden navn"}</td>
                <td className="border px-3 py-2">
                  {typeof p.age === "number" && p.age > 0 ? p.age : "-"}
                </td>
                <td className="border px-3 py-2">
                  {p.userEmail ?? "(ukendt)"}
                </td>
                <td className="border px-3 py-2 text-xs text-gray-500">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleString("da-DK")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
