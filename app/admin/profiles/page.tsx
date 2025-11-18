// app/admin/profiles/page.tsx
import { prisma } from "@/lib/prisma";

// VIGTIGT: Prisma kræver Node-runtime, ikke edge
export const runtime = "nodejs";
// Admin-side skal altid være dynamisk
export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  let profiles: {
    id: string;
    name: string | null;
    age: number;
    bio: string | null;
    user: { email: string };
  }[] = [];
  let error: string | null = null;

  try {
    profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: { email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e: any) {
    console.error("Fejl ved hentning af profiler:", e);
    error = e?.message ?? "Ukendt fejl";
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin – Profiler</h1>

      {error && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Kunne ikke hente profiler.</p>
          <p className="mt-1">
            Tekniske detaljer: <code>{error}</code>
          </p>
        </div>
      )}

      {!error && (
        <>
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
        </>
      )}
    </main>
  );
}
