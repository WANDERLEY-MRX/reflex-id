// Stub - Auth is handled by local-auth-provider.tsx (localStorage for MVP)
// This file exists only to prevent import errors

export async function auth() {
  return null;
}

export async function signIn() {
  return { error: "Use local auth provider" };
}

export async function signOut() {
  return {};
}

export const handlers = {};
