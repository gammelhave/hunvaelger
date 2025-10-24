// app/page.jsx
export const dynamic = "force-dynamic";

export const metadata = {
  title: "HunVælger – Find din match",
  description:
    "Et elegant, simpelt koncept: scan, se profil, connect. Velkommen til HunVælger.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Baggrundsdeko */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-blue-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(236,72,153,0.25) 0%, rgba(59,130,246,0.25) 100%)",
        }}
      />

      {/* Header / nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="HunVælger" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">HunVælger</span>
        </a>

        <nav className="hidden gap-6 text-sm md:flex">
          <a href="/p" className="opacity-80 hover:opacity-100">
            Profiler
          </a>
          <a href="/qr/a1" className="opacity-80 hover:opacity-100">
            QR-eksempel
          </a>
          <a
            href="https://hunvaelger.vercel.app/api/health"
            className="opacity-80 hover:opacity-100"
          >
            Status
          </a>
        </nav>

        <a
          href="/p"
          className="rounded-xl border px-4 py-2 text-sm shadow-sm transition hover:shadow"
        >
          Se profiler
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:gap-14 md:pb-24 md:pt-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Mød hinanden <span className="text-pink-600">simpelt</span>. <br />
            Scan. Se. Connect.
          </h1>
          <p className="max-w-prose text-base leading-relaxed opacity-80 md:text-lg">
            HunVælger er et let, moderne match-koncept. Scan en QR, se en kort
            profil med billede og interesser – og tag kontakt, når kemien er der.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/p"
              className="rounded-xl bg-black px-5 py-3 text-white shadow-md transition hover:translate-y-[-1px] hover:shadow-lg"
            >
              Se profiler
            </a>
            <a
              href="/qr/a1"
              className="rounded-xl border px-5 py-3 shadow-sm transition hover:shadow"
            >
              Print en QR
            </a>
          </div>

          <ul className="mt-6 grid gap-3 text-sm opacity-80">
            <li>• Ingen app-krav, alt kører i browseren</li>
            <li>• Hurtig profilvisning med billeder</li>
            <li>• QR-kort til events, barer og vennekredse</li>
          </ul>
        </div>

        {/* Hero-kort / mock */}
        <div className="relative">
          <div className="rounded-3xl border bg-white/70 p-4 shadow-xl backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Anna", img: "/avatars/anna.jpg", meta: "27 • Sønderborg" },
                { name: "Mads", img: "/avatars/mads.jpg", meta: "31 • Nordborg" },
              ].map((p) => (
                <a
                  key={p.name}
                  href={`/p/${p.name === "Anna" ? "a1" : "b2"}`}
                  className="group rounded-2xl border p-3 transition hover:shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm opacity-70">{p.meta}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* dekorativ skygge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 -bottom-6 h-10 rounded-full blur-2xl opacity-40"
            style={{ background: "radial-gradient(60% 60% at 50% 50%, #0003, transparent 70%)" }}
          />
        </div>
      </section>

      {/* Feature-række */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Nemt at komme i gang</h3>
            <p className="mt-2 text-sm opacity-80">
              Opret profiler som simple JSON-data eller koble en database på senere.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">QR overalt</h3>
            <p className="mt-2 text-sm opacity-80">
              Generér printvenlige QR-koder til events, kort eller visitkort.
            </p>
          </div>
          <div className="rounded-2xl border bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-lg font-semibold">Skalerbart</h3>
            <p className="mt-2 text-sm opacity-80">
              Klar til real data (MongoDB), admin panel og branding—når du er.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm opacity-70 md:flex-row">
          <p>© {new Date().getFullYear()} HunVælger</p>
          <div className="flex gap-6">
            <a className="hover:opacity-100 opacity-80" href="/p">Profiler</a>
            <a className="hover:opacity-100 opacity-80" href="/qr/a1">QR</a>
            <a className="hover:opacity-100 opacity-80" href="/api/health">Status</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
