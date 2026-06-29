"use client"

import {
  Eye,
  ShieldCheck,
  TrendingUp,
  Trophy,
  ArrowRight,
  PenSquare,
  Upload,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    label: "Visualizações do Perfil",
    value: "1.234",
    change: "+12%",
    icon: Eye,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Nível de Verificação",
    value: "Prata",
    change: "Bronze → Prata",
    icon: ShieldCheck,
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Índice de Confiança",
    value: "87%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    label: "Conquistas",
    value: "12",
    change: "+3 este mês",
    icon: Trophy,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
]

const recentActivities = [
  {
    id: "1",
    type: "Conquista",
    title: "Perfil Completo",
    description: "Você completou todas as seções do seu perfil",
    time: "2 horas atrás",
  },
  {
    id: "2",
    type: "Verificação",
    title: "Documento Verificado",
    description: "Seu diploma foi verificado com sucesso",
    time: "1 dia atrás",
  },
  {
    id: "3",
    type: "Projeto",
    title: "Novo Projeto Adicionado",
    description: 'Projeto "Reflex ID" adicionado ao portfólio',
    time: "3 dias atrás",
  },
  {
    id: "4",
    type: "Conexão",
    title: "Nova Conexão",
    description: "João Silva seguiu você",
    time: "5 dias atrás",
  },
]

const quickActions = [
  { label: "Editar Perfil", icon: PenSquare, href: "/profile" },
  { label: "Adicionar Projeto", icon: Upload, href: "/profile/projects" },
  { label: "Nova Evidência", icon: Upload, href: "/evidences" },
  { label: "Convidar", icon: UserPlus, href: "/verifications" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Bem-vindo ao seu painel Reflex ID
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    metric.color,
                  )}
                >
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-zinc-400">
                  {metric.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-zinc-500">{metric.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Atividades Recentes</h2>
            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {activity.type.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-zinc-500 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Progress + Quick Actions */}
        <div className="space-y-6">
          {/* Profile Progress */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Completude do Perfil</h2>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Progresso</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-violet-600 transition-all"
                style={{ width: "65%" }}
              />
            </div>
            <ul className="mt-4 space-y-2 text-xs text-zinc-500">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Informações básicas
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Foto
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Experiência
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                Projetos
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Ações Rápidas</h2>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Icon size={16} className="text-zinc-400" />
                    {action.label}
                    <ArrowRight size={14} className="ml-auto text-zinc-400" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
