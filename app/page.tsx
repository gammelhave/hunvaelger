// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero */}
      <section className="container mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mx-auto">
          <span className="text-3xl">💗</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            HunVælger
          </h1>
        </div>
        <p className="mt-3 text-sm sm:text-base text-zinc-600">
          Danmarks nye platform hvor kvinder vælger&nbsp;— og mænd viser sig fra deres bedste side.
        </p>

        <div className="mt-6">
          <Link
            href="/profiles"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-pink-600 text-white hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 transition"
          >
            Se profiler
            <span className="ml-2">🫶</span>
          </Link>
        </div>
      </section>

      {/* Sådan fungerer */}
      <section className="container mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center text-xl sm:text-2xl font-bold">
          Sådan fungerer <span className="text-pink-600">HunVælger</span>
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Scan QR",
              emoji: "📱",
              text:
                "Find en HunVælger QR-kode i byen, på events eller online — og kom direkte til profilen.",
            },
            {
              title: "Se profil",
              emoji: "🧑‍🎤",
              text:
                "Læs om personen, interesser og se billeder — alt præsenteret på en enkel og ærlig måde.",
            },
            {
              title: "Connect",
              emoji: "💬",
              text:
                "Del QR’en, skriv sammen og se hvor kemien fører jer hen.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur px-6 py-5 text-center shadow-sm"
            >
              <div className="text-3xl">{card.emoji}</div>
              <h3 className="mt-2 font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Om */}
      <section className="container mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-center text-xl sm:text-2xl font-bold">Om HunVælger</h2>
        <p className="mt-3 text-center text-sm sm:text-base text-zinc-700 leading-relaxed">
          HunVælger er skabt som et moderne, ærligt og legende datingkoncept — hvor
          kvinden tager initiativet, og mødet starter med et smil. Platformen forener
          den digitale verden med ægte menneskelig kemi, og gør det nemt at opdage nye
          forbindelser gennem QR-koder, events og personlighed. Vores mission er enkel:
          at skabe en platform, hvor respekt, nysgerrighed og ligeværd er i centrum —
          og hvor det aldrig har været sjovere at sige “hej”.
        </p>
      </section>
    </main>
  );
}
