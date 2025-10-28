"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, X } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/", label: "Forside" },
    { href: "/p", label: "Se profiler" },
    { href: "/tilmeld", label: "Opret profil" },
    { href: "/om", label: "Om" },
    { href: "/kontakt", label: "Kontakt" },
  ]

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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-pink-500 transition-colors ${
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-pink-500"
                  : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 hover:text-pink-500 transition"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <nav className="md:hidden border-t bg-white shadow-sm animate-slideDown">
          <ul className="flex flex-col py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 text-sm ${
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                      ? "text-pink-500 font-semibold"
                      : "text-gray-700"
                  } hover:bg-pink-50`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
