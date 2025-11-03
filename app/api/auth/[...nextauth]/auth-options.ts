// app/api/auth/[...nextauth]/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { verifyUser } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Adgangskode", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await verifyUser(credentials.email, credentials.password);
        if (!user) return null;

        // Returner kun nødvendige data til session
        return {
          id: user.email,
          name: user.name,
          email: user.email,
          gender: user.gender,
        };
      },
    }),
  ],

  // Session gemmes som JWT (hurtigt og sikkert)
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.gender = user.gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email as string,
          name: session.user?.name || "",
          gender: token.gender as string,
        };
      }
      return session;
    },
  },
};
