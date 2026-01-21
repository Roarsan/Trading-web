import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
  providers: [
    GoogleProvider({
      clientId: env.googleId,
      clientSecret: env.googleSecret,
    }),
  ],
  session: { strategy: "jwt" },
  secret: env.nextAuthSecret,
};
