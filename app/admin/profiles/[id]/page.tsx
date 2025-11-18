// app/admin/profiles/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function AdminProfileDetail({ params }: Props) {
  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { email: true, createdAt: true },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/admin/profiles"
        className="text-sm text-pink-600 hover:underline"
      >
        ← Tilbage til oversigten
      </Link>

      <h1 className="mt-4 text-3xl font-semibold mb-4">
        Profil: {profile.name || "–"}
      </h1>

      <dl className="space-y-2 text-sm">
        <div>
          <dt className="font-medium text-gray-700">Email</dt>
          <dd>{profile.user?.email ?? "ingen email"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Alder</dt>
          <dd>{profile.age ?? "–"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Bio</dt>
          <dd>{profile.bio || "–"}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Oprettet</dt>
          <dd>
            {profile.user?.createdAt
              ? new Date(profile.user.createdAt).toLocaleString("da-DK")
              : "–"}
          </dd>
        </div>
      </dl>
    </main>
  );
}
