"use client"

import Link from "next/link"

export function AboutTeaser() {
  return (
    <section className="mt-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border bg-gradient-to-b from-white to-pink-50 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            Om <span className="text-pink-500">HunVælger</span>
          </h2>
          <p className="text-gray-700 leading-7 mb-5">
            HunVælger er et moderne, ærligt og legende datingkoncept —
            hvor kvinder tager initiativet, og mænd viser sig fra deres bedste side.
            Vi forbinder QR-koder i den virkelige verden med korte, ærlige profiler online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/om"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-pink-500 text-white font-medium hover:opacity-95 transition"
            >
              Læs mere om HunVælger
            </Link>
            <Link
              href="/p"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-pink-200 text-pink-600 font-medium hover:bg-pink-50 transition"
            >
              Se profiler
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
