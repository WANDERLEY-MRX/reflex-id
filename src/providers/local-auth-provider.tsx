"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type LocalUser,
  type LocalProfile,
  getCurrentUser,
  getCurrentProfile,
  setSession,
  clearSession,
  authenticateUser,
  registerUser,
  seedDemoData,
} from "@/lib/local-db";

interface LocalSession {
  user: LocalUser;
  profile: LocalProfile | null;
}

interface LocalAuthContextType {
  session: LocalSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshSession: () => void;
}

const LocalAuthContext = createContext<LocalAuthContextType | null>(null);

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession_] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(() => {
    const user = getCurrentUser();
    if (user) {
      const profile = getCurrentProfile();
      setSession_({ user, profile });
    } else {
      setSession_(null);
    }
  }, []);

  useEffect(() => {
    seedDemoData();
    refreshSession();
    setLoading(false);
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const user = authenticateUser(email, password);
    if (!user) {
      return { success: false, error: "Email ou senha incorretos" };
    }
    setSession(user.id);
    refreshSession();
    return { success: true };
  }, [refreshSession]);

  const signUp = useCallback(async (email: string, name: string, password: string) => {
    const user = registerUser(email, name, password);
    if (!user) {
      return { success: false, error: "Este email já está cadastrado" };
    }
    setSession(user.id);
    refreshSession();
    return { success: true };
  }, [refreshSession]);

  const signOut = useCallback(() => {
    clearSession();
    setSession_(null);
  }, []);

  return (
    <LocalAuthContext.Provider value={{ session, loading, signIn, signUp, signOut, refreshSession }}>
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth(): LocalAuthContextType {
  const ctx = useContext(LocalAuthContext);
  if (!ctx) {
    return {
      session: null,
      loading: true,
      signIn: async () => ({ success: false }),
      signUp: async () => ({ success: false }),
      signOut: () => {},
      refreshSession: () => {},
    };
  }
  return ctx;
}
