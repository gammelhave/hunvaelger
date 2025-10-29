// lib/db-kv.ts
import { kv } from "@vercel/kv"

export type Profile = {
  id: string
  name: string
  age?: number
  bio?: string
}

const KEY = "profiles"

export async function readProfiles(): Promise<Profile[]> {
  const data = await kv.get<Profile[]>(KEY)
  return Array.isArray(data) ? data : []
}

export async function writeProfiles(list: Profile[]) {
  await kv.set(KEY, list)
}

export async function addProfile(input: Omit<Profile, "id">) {
  const id = String(Date.now())
  const profile: Profile = { id, ...input }
  const list = await readProfiles()
  list.push(profile)
  await writeProfiles(list)
  return profile
}

export async function deleteProfile(id: string) {
  const list = await readProfiles()
  const updated = list.filter((p) => p.id !== id)
  await writeProfiles(updated)
  return { ok: true }
}

export async function clearProfiles() {
  await writeProfiles([])
  return { ok: true }
}

export async function updateProfile(
  id: string,
  data: Partial<Omit<Profile, "id">>
) {
  const list = await readProfiles()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return { ok: false, error: "Not found" as const }

  const prev = list[idx]
  const next: Profile = {
    ...prev,
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.age !== undefined ? { age: data.age } : {}),
    ...(data.bio !== undefined ? { bio: data.bio } : {}),
  }
  list[idx] = next
  await writeProfiles(list)
  return { ok: true, profile: next }
}
