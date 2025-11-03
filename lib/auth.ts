// lib/auth.ts
import { kv } from "@/lib/kv";
import bcrypt from "bcryptjs";

/**
 * Brugerdata gemmes i Upstash KV under nøglen "users"
 * Format:
 * [
 *   { email: string, passwordHash: string, gender: "female" | "male", name: string }
 * ]
 */

type User = {
  email: string;
  passwordHash: string;
  gender: "female" | "male";
  name: string;
};

const USERS_KEY = "users";

/** Hent alle brugere */
export async function readUsers(): Promise<User[]> {
  const data = await kv.get<string>(USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as User[];
  } catch {
    return [];
  }
}

/** Gem hele listen af brugere */
export async function saveUsers(list: User[]) {
  await kv.set(USERS_KEY, JSON.stringify(list));
}

/** Find bruger ud fra email */
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((u) => u.email === email) || null;
}

/** Opret en ny kvinde-bruger (kun kvinder kan oprette profiler) */
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  const users = await readUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("Bruger findes allerede");

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = { email, passwordHash, gender: "female", name };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

/** Valider login (returnerer bruger hvis korrekt) */
export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
