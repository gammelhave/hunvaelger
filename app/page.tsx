// app/page.tsx
import Hero from "@/components/Hero"
import { AboutTeaser } from "@/components/AboutTeaser"
import FAQ from "@/components/FAQ"

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <AboutTeaser />
      <FAQ />
    </main>
  )
}
