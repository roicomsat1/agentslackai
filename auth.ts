import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma, hasDb } from "@/lib/db";

const providers: any[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(c) {
      if (!hasDb) return null;
      const email = String(c?.email || "").toLowerCase().trim();
      const password = String(c?.password || "");
      if (!email || !password) return null;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;
      if (!(await bcrypt.compare(password, user.passwordHash))) return null;
      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];
export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
if (googleEnabled) providers.push(Google);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && hasDb && user.email) {
        const email = user.email.toLowerCase();
        await prisma.user.upsert({ where: { email }, update: {}, create: { email, name: user.name, image: user.image } });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email && hasDb) {
        const u = await prisma.user.findUnique({ where: { email: user.email.toLowerCase() } });
        if (u) token.uid = u.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.uid && session.user) (session.user as any).id = token.uid;
      return session;
    },
  },
});
