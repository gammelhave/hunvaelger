import { kv } from "@/lib/kv";
import type { Metadata } from "next";

type Profile = {
  id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
  slug: string;
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const arrStr = await kv.get<string>("profiles");
  if (!arrStr) return null;
  let list: Profile[] = [];
  try { list = JSON.parse(arrStr); } catch { return null; }
  return list.find(p => p.slug === slug) || null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const p = await getProfileBySlug(params.slug);
  if (!p) return <div className="max-w-xl mx-auto p-6">Profil ikke fundet.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{p.name}, {p.age}</h1>
      <p className="whitespace-pre-wrap">{p.bio}</p>
      {p.images?.length ? (
        <div className="grid grid-cols-3 gap-2">
          {p.images.map((u) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={u} src={u} alt="" className="w-full h-28 object-cover rounded-lg border" />
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">Ingen billeder endnu.</p>}
    </div>
  );
}
