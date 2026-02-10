"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    isLoading: status === "loading",
    isAuthed: status === "authenticated",
    email: session?.user?.email ?? null,
    signIn: () => signIn("google"),
    signOut: () => signOut(),
  };
}
