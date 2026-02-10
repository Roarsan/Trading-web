// src/types/next-auth.d.ts
import { type DefaultSession, type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
  }
}
