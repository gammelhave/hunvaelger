import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchProfile(id) {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");

  const res = await fetch(
    `${origin}/api/profiles?id=${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { profile: null, origin };
  const json = await res.json();
  return { profile: json?.ok ? json.data : null, origin };
}

export default async function ProfileDetail({ params }) {
  const { profile: p, origin } = await fetchProfile(params.id);

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

  // Forbered data til share-script (sikkert serialiseret)
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
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo || "/avatars/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover"
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
                <span
                  key={t}
                  className="rounded-full border px-3 py-1 text-sm"
                >
                  {t}
                </span>
              ))}
              {(!p.interests || p.interests.length === 0) && (
                <span className="text-sm opacity-70">Ingen interesser angivet</span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/qr/${encodeURIComponent(p.id)}`}
                className="inline-block rounded-xl border px-4 py-2 hover:shadow transition"
              >
                Print QR til {p.name}
              </a>

              {/* Knappen får funktionalitet via script længere nede */}
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

      {/* Inline script der håndterer deling / kopiering uden "use client" */}
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
