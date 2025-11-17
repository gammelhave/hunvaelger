// app/admin/profiles/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminProfilesPage() {
  // Tjek at vi er logget ind
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect("/admin/login?next=/admin/profiles");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Admin – profiler</h1>
      <p className="text-sm text-gray-600">
        Du er logget ind som <span className="font-medium">{email}</span>.
      </p>
      <p className="mt-4">
        Denne side er den enkle test-version uden databasekald. 
        Hvis du kan se denne tekst, virker admin-ruten – så kan vi
        bagefter koble database-listen på trin for trin.
      </p>
    </main>
  );
}
