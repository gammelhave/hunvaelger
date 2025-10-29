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

export async function addProfile(input: Omit<Profile, "id">) {
  const id = String(Date.now())
  const newProfile: Profile = { id, ...input }
  const current = await readProfiles()
  const updated = [...current, newProfile]
  await kv.set(KEY, updated)
  return newProfile
  }
export async function deleteProfile(id: string) {
  const list = await readProfiles()
  const updated = list.filter((p) => p.id !== id)
  await kv.set(KEY, updated)
  return { ok: true }
}

export async function clearProfiles() {
  await kv.set(KEY, [])
  return { ok: true }
}
