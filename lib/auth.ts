import { kv } from "./kv";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export type User = {
  id: string;
  email: string;
  role: "woman" | "man";
  passwordHash: string;
  createdAt: number;
};

export async function findUserByEmail(email: string): Promise<User | null> {
  const u = await kv.get<User>(`users:${email.toLowerCase()}`);
  return u || null;
}

export async function createUser(email: string, password: string, role: "woman" | "man") {
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    role,
    passwordHash,
    createdAt: Date.now(),
  };
  await kv.set(`users:${user.email}`, user);
  return user;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function requireWomanSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { ok: false as const, error: "UNAUTHENTICATED" };
  const u = await findUserByEmail(session.user.email);
  if (!u || u.role !== "woman") return { ok: false as const, error: "FORBIDDEN" };
  return { ok: true as const, user: u };
}
