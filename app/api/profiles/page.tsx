// app/profiles/page.tsx
import Image from "next/image";

type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  img: string;
};

export default async function ProfilesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/profiles`, {
    // På Vercel/edge SSR må vi disable cache så data opdateres
    cache: "no-store",
  });
  const data = await res.json();
  const profiles: Profile[] = data?.profiles ?? [];

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold">Profiler</h1>
        <p className="mt-2 text-zinc-600 text-sm">
          Scannet via QR eller fundet her — start samtalen, hvis kemien er der 💬
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={p.img} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">
                  {p.name} · {p.age} · {p.city}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">{p.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.interests.map((i) => (
                    <span
                      key={i}
                      className="text-xs rounded-full border px-2 py-1 bg-zinc-50"
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <button
                  className="mt-4 w-full rounded-full bg-pink-600 text-white text-sm font-semibold py-2 hover:bg-pink-700 transition"
                  onClick={() => alert("Fortsæt: chat / match / del QR")}
                >
                  Sig hej 👋
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
