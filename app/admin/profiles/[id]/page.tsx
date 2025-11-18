// app/admin/profiles/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export default async function AdminProfileDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  if (!email) {
    redirect(`/admin/login?next=/admin/profiles/${params.id}`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">
          Profil: {profile.name || "(uden navn)"}
        </h1>
        <Link
          href="/admin/profiles"
          className="text-sm text-pink-600 hover:underline"
        >
          ← Tilbage til alle profiler
        </Link>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500">
            Navn
          </div>
          <div>{profile.name || "(uden navn)"}</div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-gray-500">
            Alder
          </div>
          <div>{profile.age ?? "–"}</div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-gray-500">
            Email
          </div>
          <div>{profile.user?.email ?? "–"}</div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase text-gray-500">
            Bio
          </div>
          <div className="whitespace-pre-wrap">
            {profile.bio ?? "–"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <div className="font-semibold uppercase">Oprettet</div>
            <div>{profile.createdAt.toLocaleString("da-DK")}</div>
          </div>
          <div>
            <div className="font-semibold uppercase">Sidst opdateret</div>
            <div>{profile.updatedAt.toLocaleString("da-DK")}</div>
          </div>
        </div>
      </div>

      {/* Placeholder til DEL 5 – Slet profil */}
      <div className="mt-6">
        <p className="text-xs text-gray-500">
          Senere (DEL 5) tilføjer vi her en rød{" "}
          <span className="font-semibold">“Slet profil”</span>-knap.
        </p>
      </div>
    </main>
  );
}
