"use client"

import { motion } from "framer-motion"
import {
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { StudentCard } from "@/components/organization/student-card"

const metrics = [
  {
    label: "Jovens Acompanhados",
    value: "47",
    change: "+5 este mês",
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Verificações Pendentes",
    value: "12",
    change: "4 urgentes",
    icon: Clock,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "Verificações Concluídas",
    value: "234",
    change: "+18%",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Taxa de Aprovação",
    value: "92%",
    change: "+3%",
    icon: TrendingUp,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
  },
]

const recentCandidates = [
  { id: "1", name: "Ana Beatriz Silva", email: "ana.silva@email.com", confidenceLevel: "HIGH" as const, badges: [{ name: "Destaque", level: "GOLD" }] },
  { id: "2", name: "Carlos Eduardo Lima", email: "carlos.lima@email.com", confidenceLevel: "MEDIUM" as const, badges: [] },
  { id: "3", name: "Mariana Oliveira", email: "mariana.oliveira@email.com", confidenceLevel: "VERY_HIGH" as const, badges: [{ name: "Excelência", level: "PLATINUM" }] },
]

const pendingVerifications = [
  { id: "1", candidate: "João Pedro", type: "Experiência Profissional", date: "2 dias atrás", priority: "high" },
  { id: "2", candidate: "Laura Mendes", type: "Formação Acadêmica", date: "5 dias atrás", priority: "medium" },
  { id: "3", candidate: "Thiago Alves", type: "Certificação", date: "1 semana atrás", priority: "low" },
]

export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard do Recrutador</h1>
          <p className="text-sm text-zinc-500">Recrutador Independente</p>
        </div>
        <Button>
          <Plus size={16} />
          Adicionar Candidato
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", metric.color)}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-zinc-400">{metric.change}</span>
              </div>
              <p className="mt-3 text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-zinc-500">{metric.label}</p>
            </div>
          )
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Últimos Candidatos</h2>
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
                Ver todos <ArrowRight size={12} className="inline" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentCandidates.map((candidate) => (
                <StudentCard key={candidate.id} {...candidate} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Verificações Pendentes</h2>
            <div className="space-y-3">
              {pendingVerifications.map((pv) => (
                <div
                  key={pv.id}
                  className="flex items-start gap-3 border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800"
                >
                  <Avatar fallback={pv.candidate.charAt(0)} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{pv.candidate}</p>
                    <p className="text-xs text-zinc-500">{pv.type}</p>
                    <p className="text-[10px] text-zinc-400">{pv.date}</p>
                  </div>
                  <Badge
                    className={cn(
                      pv.priority === "high" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                      pv.priority === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                      pv.priority === "low" && "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                    size="sm"
                  >
                    {pv.priority === "high" ? "Urgente" : pv.priority === "medium" ? "Média" : "Baixa"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Estatísticas</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Verificações este mês</span>
                <span className="font-medium">34</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Taxa de resposta</span>
                <span className="font-medium text-emerald-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Tempo médio</span>
                <span className="font-medium">2.4 dias</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Candidatos ativos</span>
                <span className="font-medium">38</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
