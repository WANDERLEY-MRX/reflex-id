"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

interface CombinedProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export function CombinedProviders({
  children,
  session,
}: CombinedProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider session={session}>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
