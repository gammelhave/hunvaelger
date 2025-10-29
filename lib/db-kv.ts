// lib/db-kv.ts
import { kv } from "@vercel/kv"

export type Profile = {
  id: string
  name: string
  age?: number
  bio?: string
  active?: boolean        // soft delete flag
  deletedAt?: number | null
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
  const profile: Profile = { id, active: true, deletedAt: null, ...input }
  const list = await readProfiles()
  list.push(profile)
  await writeProfiles(list)
  return profile
}

export async function updateProfile(
  id: string,
  data: Partial<Omit<Profile, "id">>
) {
  const list = await readProfiles()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return { ok: false, error: "Not found" as const }
  const prev = list[idx]
  const next: Profile = { ...prev, ...data }
  list[idx] = next
  await writeProfiles(list)
  return { ok: true, profile: next }
}

/** Soft delete (kan gendannes) */
export async function softDeleteProfile(id: string) {
  return updateProfile(id, { active: false, deletedAt: Date.now() })
}

/** Gendan soft-deleted profil */
export async function restoreProfile(id: string) {
  return updateProfile(id, { active: true, deletedAt: null })
}

/** Hard delete (fjern helt) */
export async function hardDeleteProfile(id: string) {
  const list = await readProfiles()
  const updated = list.filter((p) => p.id !== id)
  await writeProfiles(updated)
  return { ok: true }
}

/** Tøm ALT (permanent) */
export async function clearProfilesHard() {
  await writeProfiles([])
  return { ok: true }
}
