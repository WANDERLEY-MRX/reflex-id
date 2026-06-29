"use client"

import { useQuery } from "@tanstack/react-query"

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch("/api/notifications")
  if (!res.ok) throw new Error("Falha ao carregar notificações")
  return res.json()
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    staleTime: 10_000,
  })
}
