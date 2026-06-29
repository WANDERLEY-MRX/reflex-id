"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  GraduationCap,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StudentCard } from "@/components/organization/student-card"
import { VerificationForm } from "@/components/organization/verification-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const metrics = [
  {
    label: "Total de Alunos",
    value: "234",
    change: "+12 este mês",
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Verificações Emitidas",
    value: "1.847",
    change: "+23%",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "Engajamento",
    value: "87%",
    change: "+5%",
    icon: TrendingUp,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    label: "Solicitações Pendentes",
    value: "12",
    change: "3 novas hoje",
    icon: Activity,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
]

const recentStudents = [
  { id: "1", name: "Ana Beatriz Silva", email: "ana.silva@escola.edu", confidenceLevel: "HIGH" as const, badges: [{ name: "Destaque", level: "GOLD" }], grade: "3", class: "A" },
  { id: "2", name: "Carlos Eduardo Lima", email: "carlos.lima@escola.edu", confidenceLevel: "MEDIUM" as const, badges: [], grade: "2", class: "B" },
  { id: "3", name: "Mariana Oliveira", email: "mariana.oliveira@escola.edu", confidenceLevel: "VERY_HIGH" as const, badges: [{ name: "Excelência", level: "PLATINUM" }], grade: "3", class: "A" },
  { id: "4", name: "Pedro Henrique Santos", email: "pedro.santos@escola.edu", confidenceLevel: "LOW" as const, badges: [], grade: "1", class: "C" },
]

const progressData = [
  { label: "Alunos Ativos", value: 92, color: "bg-violet-600" },
  { label: "Verificações Completas", value: 78, color: "bg-emerald-500" },
  { label: "Perfis Completos", value: 65, color: "bg-blue-500" },
  { label: "Badges Conquistadas", value: 45, color: "bg-amber-500" },
]

export default function SchoolDashboardPage() {
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard da Escola</h1>
          <p className="text-sm text-zinc-500">Colégio Estadual Reflex</p>
        </div>
        <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} />
              Emitir Verificação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Verificação</DialogTitle>
            </DialogHeader>
            <VerificationForm
              studentName={selectedStudent?.name}
              studentId={selectedStudent?.id}
              onSubmit={async () => {
                await new Promise((r) => setTimeout(r, 1000))
                setVerificationOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
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
              <h2 className="font-semibold">Alunos Recentes</h2>
              <button className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
                Ver todos <ArrowRight size={12} className="inline" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  {...student}
                  onView={(id) => {}}
                  onVerify={(id) => {
                    setSelectedStudent({ id, name: student.name })
                    setVerificationOpen(true)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold">Evolução dos Alunos</h2>
            <div className="space-y-4">
              {progressData.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-2.5 rounded-full transition-all", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Ações Rápidas</h2>
            <div className="space-y-2">
              {[
                { label: "Adicionar Aluno", icon: Users },
                { label: "Nova Verificação", icon: ShieldCheck },
                { label: "Relatório de Turma", icon: GraduationCap },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Icon size={16} className="text-zinc-400" />
                    {action.label}
                    <ArrowRight size={14} className="ml-auto text-zinc-400" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Resumo da Semana</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Novos alunos</span>
                <span className="font-medium text-emerald-600">+8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Verificações</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Pendentes</span>
                <span className="font-medium text-amber-600">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Taxa de conclusão</span>
                <span className="font-medium">82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
