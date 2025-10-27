export const metadata = {
  title: "Om HunVælger",
  description:
    "HunVælger er et moderne, ærligt og legende datingkoncept, hvor kvinder tager initiativet.",
}

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Om <span className="text-pink-500">HunVælger</span>
      </h1>
      <p className="text-gray-700 leading-7 mb-4">
        HunVælger er skabt som et moderne, ærligt og legende datingkoncept —
        hvor kvinder enkelt kan tage initiativet, og mænd viser sig fra deres
        bedste side. Platformen forbinder den digitale verden med ægte
        menneskelig kemi via QR-koder, korte profiler og respektfuld kontakt.
      </p>
      <p className="text-gray-700 leading-7 mb-4">
        Vores mission er enkel: at skabe en platform, hvor respekt, nysgerrighed
        og ligeværd er i centrum — og hvor det aldrig har været lettere at sige
        “hej”.
      </p>

      <div className="mt-8 rounded-2xl border bg-gradient-to-b from-white to-pink-50 p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Sådan virker det</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Scan en HunVælger QR-kode – i byen, til events eller online.</li>
          <li>Se en kort, ærlig profil med interesser og billeder.</li>
          <li>Connect – skriv sammen og se hvor kemien fører jer hen.</li>
        </ul>
      </div>
    </section>
  )
}
