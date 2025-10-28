import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
        {/* Tekst */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            Når <span className="text-pink-500">hun</span> vælger 💕
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            HunVælger er den ærlige, trygge og legende måde at møde hinanden på —
            hvor kvinder tager initiativet, og mænd viser sig fra deres bedste side.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/tilmeld"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-pink-500 text-white font-medium hover:opacity-95 transition w-full sm:w-auto"
            >
              Opret profil
            </Link>
            <Link
              href="/p"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-pink-200 text-pink-600 font-medium hover:bg-pink-50 transition w-full sm:w-auto"
            >
              Se profiler
            </Link>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Scan en QR-kode, sig “hej” — og lad kemien gøre resten.
          </p>
        </div>

        {/* Billede */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full rounded-2xl border bg-white shadow-sm overflow-hidden">
            <Image
              src="/og-preview.jpg"         // læg et passende billede i /public
              alt="HunVælger hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="pointer-events-none absolute -z-10 -right-10 -top-10 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
