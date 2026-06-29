"use client"

import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  Star,
  TrendingUp,
  ArrowRight,
  Search,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const metrics = [
  {
    label: "Candidatos em Vista",
    value: "156",
    change: "+23 esta semana",
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Vagas Abertas",
    value: "8",
    change: "2 novas hoje",
    icon: Briefcase,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Match Score Médio",
    value: "84%",
    change: "+5%",
    icon: Star,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    label: "Contratações",
    value: "12",
    change: "3 este mês",
    icon: TrendingUp,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
  },
]

const topCandidates = [
  { id: "1", name: "Lucas Almeida", role: "Desenvolvedor Full Stack", score: 96, skills: ["React", "Node.js", "TypeScript"], avatar: undefined },
  { id: "2", name: "Sofia Martins", role: "UX Designer", score: 92, skills: ["Figma", "Design Systems", "Pesquisa"], avatar: undefined },
  { id: "3", name: "Rafael Costa", role: "Analista de Dados", score: 88, skills: ["Python", "SQL", "Power BI"], avatar: undefined },
]

const recentHires = [
  { name: "Ana Beatriz", role: "Frontend Developer", date: "15 jun 2026", confidence: "HIGH" },
  { name: "Pedro Santos", role: "Backend Developer", date: "02 jun 2026", confidence: "VERY_HIGH" },
]

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard da Empresa</h1>
          <p className="text-sm text-zinc-500">Reflex Tech Solutions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Search size={16} />
            Buscar Talentos
          </Button>
          <Button>
            <Plus size={16} />
            Publicar Vaga
          </Button>
        </div>
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
              <h2 className="font-semibold">Top Candidatos</h2>
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
                Ver todos <ArrowRight size={12} className="inline" />
              </button>
            </div>
            <div className="space-y-3">
              {topCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 rounded-lg border border-zinc-100 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                  <Avatar fallback={candidate.name.charAt(0)} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{candidate.name}</p>
                    <p className="text-xs text-zinc-500">{candidate.role}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="default" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-lg font-bold text-violet-600">{candidate.score}%</span>
                    <span className="text-[10px] text-zinc-400">match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Contratações Recentes</h2>
            <div className="space-y-3">
              {recentHires.map((hire) => (
                <div key={hire.name} className="flex items-center gap-3">
                  <Avatar fallback={hire.name.charAt(0)} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{hire.name}</p>
                    <p className="text-xs text-zinc-500">{hire.role}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400">{hire.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Vagas em Destaque</h2>
            <div className="space-y-3 text-sm">
              {["Senior Frontend", "Backend Engineer", "Data Scientist"].map((job) => (
                <div key={job} className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">{job}</span>
                  <Badge variant="info" size="sm">Ativa</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
