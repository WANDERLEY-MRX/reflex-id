"use client"

import { useQuery } from "@tanstack/react-query"

interface User {
  id: string
  name: string
  email: string
  image: string | null
  slug: string | null
  headline: string | null
  bio: string | null
  location: string | null
}

async function fetchUser(): Promise<User> {
  const res = await fetch("/api/user")
  if (!res.ok) throw new Error("Falha ao carregar usuário")
  return res.json()
}

export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
