"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-16 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4 py-10 text-center text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <Link href="/om" className="hover:text-pink-500 transition-colors">
            Om HunVælger
          </Link>
          <span className="hidden md:inline">•</span>
          <Link href="/kontakt" className="hover:text-pink-500 transition-colors">
            Kontakt
          </Link>
          <span className="hidden md:inline">•</span>
          <Link href="/privatliv" className="hover:text-pink-500 transition-colors">
            Privatlivspolitik
          </Link>
        </div>

        <p className="text-gray-500">
          © {new Date().getFullYear()} <strong>HunVælger</strong> — skabt med kærlighed ❤️
        </p>
      </div>
    </footer>
  )
}
