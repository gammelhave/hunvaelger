import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Adgangskode", type: "password" },
        admin: { label: "admin", type: "text" }, // skjult flag
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password ?? "";
        const wantsAdmin = credentials?.admin === "1";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        if (wantsAdmin) {
          const admin = await prisma.admin.findUnique({ where: { email } });
          if (!admin) return null; // ikke admin → afvis
        }

        return { id: user.id, email: user.email, name: user.profile?.name ?? undefined };
      },
    }),
  ],
  pages: { signIn: "/login" }, // almindelig login-side
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) (session.user as any).id = token.sub;
      if (token?.email) session.user!.email = token.email as string;
      if (token?.name) session.user!.name = token.name as string;

      // Tilføj admin-flag til session til UI-brug
      if (session.user?.email) {
        const admin = await prisma.admin.findUnique({ where: { email: session.user.email } });
        (session as any).isAdmin = !!admin;
        (session as any).adminRole = admin?.role ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
