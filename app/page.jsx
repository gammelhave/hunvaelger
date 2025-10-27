export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-white text-center px-6">
      {/* Hero section */}
      <section className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
          <span className="text-pink-500">♥</span> Hun<span className="text-gray-800">Vælger</span>
        </h1>
        <p className="max-w-md text-gray-700 text-lg mb-6">
          Danmarks nye platform hvor kvinder vælger — og mænd viser sig fra deres bedste side.
        </p>
        <a
          href="/p"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition flex items-center gap-2"
        >
          Se profiler
          <span>💋</span>
        </a>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Sådan fungerer <span className="text-pink-500">HunVælger</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 text-gray-700">
            <div className="p-6 rounded-2xl shadow-sm border hover:shadow-md transition bg-pink-50">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-semibold mb-2">Scan QR</h3>
              <p>Find en HunVælger QR-kode i byen, på events eller online – og kom direkte til profilen.</p>
            </div>

            <div className="p-6 rounded-2xl shadow-sm border hover:shadow-md transition bg-pink-50">
              <div className="text-4xl mb-3">💁‍♀️</div>
              <h3 className="text-xl font-semibold mb-2">Se profil</h3>
              <p>Læs om personen, interesser og se billeder – alt præsenteret på en enkel og ærlig måde.</p>
            </div>

            <div className="p-6 rounded-2xl shadow-sm border hover:shadow-md transition bg-pink-50">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p>Del QR’en, skriv sammen og se hvor kemien fører jer hen 💖</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Vision section */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50 w-full">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Om HunVælger</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            HunVælger er skabt som et moderne, ærligt og legende datingkoncept — hvor kvinden tager initiativet,
            og mødet starter med et smil. Platformen forener den digitale verden med ægte menneskelig kemi,
            og gør det nemt at opdage nye forbindelser gennem QR-koder, events og personlighed.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Vores mission er enkel: at skabe en platform, hvor respekt, nysgerrighed og ligeværd er centrum —
            og hvor det aldrig har været sjovere at sige “hej”.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-sm text-gray-500">
        © 2025 <span className="font-semibold text-gray-700">HunVælger</span> — skabt med kærlighed <span>❤️</span>
      </footer>
    </main>
  );
}
