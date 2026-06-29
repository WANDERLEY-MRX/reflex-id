"use client";

import { useLocalAuth } from "@/providers/local-auth-provider";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

export function AuthProvider({ children, session }: { children: ReactNode; session?: unknown }) {
  return <SessionProvider session={session as any}>{children}</SessionProvider>;
}

export { useLocalAuth as useAuth };
