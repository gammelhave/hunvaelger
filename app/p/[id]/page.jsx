import { headers } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function fetchProfileWithOrigin(id) {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
  const res = await fetch(
    `${origin}/api/profiles?id=${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { p: null, origin };
  const json = await res.json();
  return { p: json?.ok ? json.data : null, origin };
}

export async function generateMetadata({ params }) {
  const { p, origin } = await fetchProfileWithOrigin(params.id);
  if (!p) return { title: "Profil ikke fundet" };

  const title = `HunVælger – ${p.name}`;
  const description = `${p.name}, ${p.age} • ${p.city}${
    p.bio ? " — " + p.bio : ""
  }`;
  const image = p.photo || "/og-preview.jpg";
  const url = `${origin}/p/${p.id}`;

  return {
    title,
    description,
    openGraph: { title, description, url, images: [image], type: "profile" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProfileDetail({ params }) {
  const { p, origin } = await fetchProfileWithOrigin(params.id);

  if (!p) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <a href="/p" className="text-sm underline opacity-70">
          ← Tilbage
        </a>
        <h1 className="mt-4 text-2xl font-bold">Profil blev ikke fundet.</h1>
      </main>
    );
  }

  // Data til deling (bruges i inline script)
  const sharePayload = {
    title: `HunVælger – ${p.name}`,
    text: `${p.name}, ${p.age} • ${p.city}\n${p.bio || ""}`,
    url: `${origin}/p/${p.id}`,
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <a href="/p" className="text-sm underline opacity-70">
        ← Tilbage
      </a>

      <div className="rounded-2xl border p-4">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="sm:w-1/3">
            <div className="overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={p.photo || "/avatars/placeholder.jpg"}
                alt={p.name}
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          <div className="sm:flex-1">
            <h1 className="text-3xl font-bold">{p.name}</h1>
            <p className="opacity-70">
              {p.age} • {p.city}
            </p>
            {p.bio && <p className="mt-3 whitespace-pre-line">{p.bio}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {(p.interests || []).map((t) => (
                <span key={t} className="rounded-full border px-3 py-1 text-sm">
                  {t}
                </span>
              ))}
              {(!p.interests || p.interests.length === 0) && (
                <span className="text-sm opacity-70">
                  Ingen interesser angivet
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/qr/${encodeURIComponent(p.id)}`}
                className="inline-block rounded-xl border px-4 py-2 hover:shadow transition"
              >
                Print QR til {p.name}
              </a>

              <button
                id="share-btn"
                type="button"
                className="inline-block rounded-xl border px-4 py-2 hover:shadow transition"
              >
                Del profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline script til deling/kopiering – fungerer uden "use client" */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  try {
    var payload = ${JSON.stringify(sharePayload)};
    var btn = document.getElementById('share-btn');
    if (!btn) return;
    btn.addEventListener('click', function(e){
      e.preventDefault();
      if (navigator.share) {
        navigator.share(payload).catch(function(){});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload.url)
          .then(function(){ alert('Link kopieret til udklipsholder 📋'); })
          .catch(function(){ window.prompt('Kopiér dette link:', payload.url); });
      } else {
        window.prompt('Kopiér dette link:', payload.url);
      }
    });
  } catch (e) {}
})();
        `,
        }}
      />
    </main>
  );
}
