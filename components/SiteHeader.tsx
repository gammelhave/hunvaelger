"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="font-semibold text-lg text-gray-900">
            Hun<span className="text-pink-500">Vælger</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`hover:text-pink-500 transition-colors ${
              pathname === "/" ? "text-pink-500" : "text-gray-700"
            }`}
          >
            Forside
          </Link>
          <Link
            href="/p"
            className={`hover:text-pink-500 transition-colors ${
              pathname.startsWith("/p") ? "text-pink-500" : "text-gray-700"
            }`}
          >
            Se profiler
          </Link>
          <Link
            href="/om"
            className={`hover:text-pink-500 transition-colors ${
              pathname === "/om" ? "text-pink-500" : "text-gray-700"
            }`}
          >
            Om
          </Link>
          <Link
            href="/kontakt"
            className={`hover:text-pink-500 transition-colors ${
              pathname === "/kontakt" ? "text-pink-500" : "text-gray-700"
            }`}
          >
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  )
}
