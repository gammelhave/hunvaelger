// app/p/page.tsx
export const dynamic = "force-dynamic"

import { readProfiles } from "@/lib/db-kv"

type Profile = { id: string; name: string; age?: number; bio?: string }

export default async function ProfilesPage() {
  const profiles: Profile[] = await readProfiles()

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Profiler
      </h1>

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
