"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { AboutTeaser } from "@/components/AboutTeaser"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-b from-white to-pink-50">
      {/* Hero-sektion */}
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <Heart className="w-10 h-10 text-pink-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          Når <span className="text-pink-500">hun</span> vælger 💕
        </h1>

        <p className="text-lg text-gray-700 leading-7 mb-8">
          HunVælger er den nye måde at møde hinanden på — hvor kvinder tager
          initiativet, og mænd viser sig fra deres bedste side.
          En ærlig, legende og tryg datingoplevelse, der starter med et smil og en QR-kode.
        </p>

        {/* CTA-knapper */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/p"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-pink-500 text-white font-medium hover:opacity-95 transition w-full sm:w-auto"
          >
            Se profiler
          </Link>
          <Link
            href="/tilmeld"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-pink-200 text-pink-600 font-medium hover:bg-pink-50 transition w-full sm:w-auto"
          >
            Opret profil
          </Link>
        </div>
      </div>

      {/* Om HunVælger teaser */}
      <AboutTeaser />
    </main>
  )
}
