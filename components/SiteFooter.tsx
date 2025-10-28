"use client"

import Link from "next/link"
import { Heart, Facebook, Instagram, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-gradient-to-t from-pink-50 to-white mt-16">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <span className="font-semibold text-gray-900">
            Hun<span className="text-pink-500">Vælger</span>
          </span>
          <span className="text-gray-500">© {new Date().getFullYear()}</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5">
          <Link href="/om" className="hover:text-pink-500 transition-colors">
            Om
          </Link>
          <Link href="/kontakt" className="hover:text-pink-500 transition-colors">
            Kontakt
          </Link>
          <Link href="/privatliv" className="hover:text-pink-500 transition-colors">
            Privatliv
          </Link>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="mailto:info@hunvaelger.dk"
            className="hover:text-pink-500 transition-colors"
            aria-label="E-mail"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
