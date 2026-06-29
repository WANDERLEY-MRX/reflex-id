"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, ShieldCheck, TrendingUp, Trophy, ArrowRight, PenSquare, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocalAuth } from "@/providers/local-auth-provider"

export default function DashboardPage() {
  const { session, loading } = useLocalAuth()
  const user = session?.user

  if (loading) {
    return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" /></div>
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Olá, {user?.name ?? "Usuário"} 👋
        </h1>
        <p className="text-zinc-500">
          Bem-vindo ao seu painel de identidade digital.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Visualizações", value: "0", icon: Eye, color: "text-blue-500" },
          { label: "Evidências", value: "0", icon: ShieldCheck, color: "text-green-500" },
          { label: "Habilidades", value: "0", icon: TrendingUp, color: "text-orange-500" },
          { label: "Conquistas", value: "0", icon: Trophy, color: "text-yellow-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon size={24} className={color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/profile"
          className="group flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-950"
        >
          <div className="flex items-center gap-3">
            <PenSquare size={20} className="text-violet-500" />
            <div>
              <p className="font-medium">Editar Perfil</p>
              <p className="text-sm text-zinc-500">Atualize suas informações</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/profile/skills"
          className="group flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-950"
        >
          <div className="flex items-center gap-3">
            <UserPlus size={20} className="text-green-500" />
            <div>
              <p className="font-medium">Adicionar Habilidade</p>
              <p className="text-sm text-zinc-500">Mostre suas competências</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/evidences"
          className="group flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-950"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-blue-500" />
            <div>
              <p className="font-medium">Evidências</p>
              <p className="text-sm text-zinc-500">Gerencie suas provas</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/profile/projects"
          className="group flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-950"
        >
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-yellow-500" />
            <div>
              <p className="font-medium">Projetos</p>
              <p className="text-sm text-zinc-500">Adicione seus projetos</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
