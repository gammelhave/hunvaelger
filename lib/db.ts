// lib/db.ts
import { promises as fs } from "fs"
import path from "path"

export type Profile = {
  id: string
  name: string
  age?: number
  bio?: string
}

function isVercel() {
  return !!process.env.VERCEL
}

function dataDir() {
  // Lokalt: ./data  —  Vercel: /tmp
  return isVercel() ? "/tmp" : path.join(process.cwd(), "data")
}

function dataFile() {
  return path.join(dataDir(), "profiles.json")
}

export async function readProfiles(): Promise<Profile[]> {
  try {
    const file = dataFile()
    const raw = await fs.readFile(file, "utf8")
    const json = JSON.parse(raw)
    return Array.isArray(json) ? (json as Profile[]) : []
  } catch (err: any) {
    // Hvis fil ikke findes: returnér seed-data
    return [
      { id: "1", name: "Mads", age: 29, bio: "Kaffe, kajak og koncertfreak." },
      { id: "2", name: "Jonas", age: 34, bio: "Surdej, trail-løb og filmnørd." },
    ]
  }
}

export async function writeProfiles(profiles: Profile[]) {
  const dir = dataDir()
  const file = dataFile()
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(file, JSON.stringify(profiles, null, 2), "utf8")
}

export async function addProfile(input: Omit<Profile, "id">) {
  const list = await readProfiles()
  const id = String(Date.now())
  const profile: Profile = { id, ...input }
  list.push(profile)
  await writeProfiles(list)
  return profile
}
