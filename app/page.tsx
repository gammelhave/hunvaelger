"use client"

import Hero from "@/components/Hero"
import { AboutTeaser } from "@/components/AboutTeaser"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <AboutTeaser />
    </main>
  )
}
