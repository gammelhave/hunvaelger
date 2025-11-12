import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Hjælpefunktion: find admin-rollen for en email
async function getRoleForEmail(email: string | null | undefined) {
  if (!email) return "USER";
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
  return admin?.role ?? "USER"; // "MASTER" | "ADMIN" | "USER"
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Adgangskode", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.name ?? undefined,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login", // vi bruger denne til admin-login
    // (din almindelige /login kan fortsat eksistere hvis du vil, men denne er nok)
  },
  callbacks: {
    // Kør hver gang token laves/fornyes — læg role på token
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = await getRoleForEmail(user.email as string);
      } else if (!token.role) {
        // first page load uden user-objekt: hent ved behov
        token.role = await getRoleForEmail(token.email as string);
      }
      return token;
    },
    // Læg role på sessionen også (praktisk i UI)
    async session({ session, token }) {
      if (!session.user) session.user = {} as any;
      (session.user as any).id = token.sub;
      session.user.email = token.email as string;
      session.user.name = (token as any).name as string | undefined;
      (session as any).role = token.role ?? "USER";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
