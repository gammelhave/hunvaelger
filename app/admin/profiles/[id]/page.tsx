// app/admin/profiles/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

// Server-action til at slette profilen
async function deleteProfileAction(profileId: string) {
  "use server";

  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email ?? null;

  if (!email) {
    throw new Error("Ikke autoriseret");
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error("Ikke autoriseret");
  }

  // Slet profilen (brugeren får lov at blive – vi sletter kun profilen)
  await prisma.profile.delete({
    where: { id: profileId },
  });

  redirect("/admin/profiles");
}

export default async function AdminProfileDetailPage({ params }: PageProps) {
  const profileId = params.id;

  const session = await getServerSession(authOptions as any);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect(`/admin/login?next=/admin/profiles/${profileId}`);
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    redirect("/");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    notFound();
  }

  // Hent evt. tilknyttet bruger for at vise email
  const user = await prisma.user.findUnique({
    where: { id: profile.userId },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Profil-detaljer</h1>

      <div className="mb-6 text-sm text-gray-500">
        <p>
          <span className="font-medium">Profil-ID:</span>{" "}
          <span className="font-mono">{profile.id}</span>
        </p>
        {user && (
          <p>
            <span className="font-medium">Bruger-email:</span>{" "}
            {user.email}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-8">
        <div>
          <div className="text-xs uppercase text-gray-500">Navn</div>
          <div className="text-base">{profile.name}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Alder</div>
          <div className="text-base">
            {typeof profile.age === "number" && profile.age > 0
              ? profile.age
              : "-"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Beskrivelse</div>
          <div className="text-base whitespace-pre-line">
            {profile.bio ?? "(ingen tekst)"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Billeder</div>
          {Array.isArray(profile.images) && profile.images.length > 0 ? (
            <ul className="list-disc ml-5 text-sm break-all">
              {profile.images.map((url: string, i: number) => (
                <li key={i}>{url}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-400">Ingen billeder gemt.</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <a
          href="/admin/profiles"
          className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
        >
          ← Tilbage til profiler
        </a>

        <form
          action={async () => {
            "use server";
            await deleteProfileAction(profileId);
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            onClick={(e) => {
              if (
                !confirm(
                  "Er du sikker på, at du vil slette denne profil? Dette kan ikke fortrydes."
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            Slet profil
          </button>
        </form>
      </div>
    </main>
  );
}
