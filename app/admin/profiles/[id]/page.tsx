// app/admin/profiles/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteProfileButton from "./DeleteProfileButton";

interface Props {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function AdminProfileDetailPage({ params }: Props) {
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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/admin/profiles"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Tilbage til oversigten
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-4">
        Admin – profil: {profile.name || "–"}
      </h1>

      <dl className="mb-8 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-gray-700">Navn</dt>
          <dd>{profile.name || <span className="text-gray-400">ingen</span>}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Email</dt>
          <dd>
            {profile.user?.email || (
              <span className="text-gray-400">ingen</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Alder</dt>
          <dd>
            {profile.age != null ? (
              profile.age
            ) : (
              <span className="text-gray-400">ingen</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Bio</dt>
          <dd>
            {profile.bio || <span className="text-gray-400">ingen</span>}
          </dd>
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

      <div className="flex gap-3">
        {/* Redigér-knap kan vi lave senere */}
        <DeleteProfileButton id={profile.id} name={profile.name} />
      </div>
    </main>
  );
}
