import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db/prisma";

function requireEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env = {
  googleId: requireEnv("GOOGLE_ID"),
  googleSecret: requireEnv("GOOGLE_SECRET"),
  nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.googleId,
      clientSecret: env.googleSecret,
    }),
  ],
  session: { strategy: "database" },
  secret: env.nextAuthSecret,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  }
};
