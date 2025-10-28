// app/p/page.tsx
import { headers } from "next/headers"

export const dynamic = "force-dynamic" // ingen build-time caching

type Profile = { id: string; name: string; age?: number; bio?: string }

async function fetchProfiles(): Promise<Profile[]> {
  // Byg en sikker base-URL ud fra request headers
  const h = headers()
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http")
  const base = host.startsWith("http") ? host : `${proto}://${host}`

  try {
    const res = await fetch(`${base}/api/profiles`, { cache: "no-store" })
    if (!res.ok) throw new Error("Bad response")
    const data = await res.json()
    return data?.profiles ?? []
  } catch {
    // sidste fallback – relativ (kan virke lokalt)
    const res2 = await fetch("/api/profiles", { cache: "no-store" }).catch(() => null)
    if (!res2 || !res2.ok) return []
    const data2 = await res2.json().catch(() => ({}))
    return data2?.profiles ?? []
  }
}

export default async function ProfilesPage() {
  const profiles = await fetchProfiles()

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Profiler</h1>

      {profiles.length === 0 ? (
        <p className="text-gray-600">
          Ingen profiler endnu. Prøv at{" "}
          <a href="/tilmeld" className="text-pink-600 underline">oprette en</a>.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {profiles.map((p) => (
            <li key={p.id} className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {p.name}{p.age ? `, ${p.age}` : ""}
              </h3>
              {p.bio && <p className="text-gray-700 mt-2">{p.bio}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
