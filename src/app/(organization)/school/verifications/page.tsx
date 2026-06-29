"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Check, X, Clock, Eye, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VerificationForm } from "@/components/organization/verification-form"

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED"

interface VerificationRequest {
  id: string
  student: string
  studentEmail: string
  type: string
  title: string
  status: VerificationStatus
  date: string
}

const requests: VerificationRequest[] = [
  { id: "1", student: "Ana Beatriz Silva", studentEmail: "ana@escola.edu", type: "Desempenho Acadêmico", title: "Certificado de Honra", status: "PENDING", date: "27/06/2026" },
  { id: "2", student: "Carlos Lima", studentEmail: "carlos@escola.edu", type: "Comportamento", title: "Atestado de Conduta", status: "APPROVED", date: "25/06/2026" },
  { id: "3", student: "Mariana Oliveira", studentEmail: "mariana@escola.edu", type: "Competência Técnica", title: "Projeto de Robótica", status: "PENDING", date: "24/06/2026" },
  { id: "4", student: "Pedro Santos", studentEmail: "pedro@escola.edu", type: "Frequência", title: "Declaração de Frequência", status: "REJECTED", date: "22/06/2026" },
  { id: "5", student: "Julia Costa", studentEmail: "julia@escola.edu", type: "Projeto Realizado", title: "Feira de Ciências", status: "APPROVED", date: "20/06/2026" },
]

const statusConfig: Record<VerificationStatus, { label: string; class: string }> = {
  PENDING: { label: "Pendente", class: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  APPROVED: { label: "Aprovado", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  REJECTED: { label: "Rejeitado", class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  EXPIRED: { label: "Expirado", class: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" },
}

export default function VerificationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL">("ALL")

  const filtered = requests.filter((r) => {
    const matchSearch = !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verificações</h1>
          <p className="text-sm text-zinc-500">{requests.length} solicitações</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={14} />
              Nova Verificação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emitir Verificação</DialogTitle>
            </DialogHeader>
            <VerificationForm
              onSubmit={async () => { await new Promise((r) => setTimeout(r, 1000)) }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar verificações..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === status
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
              )}
            >
              {status === "ALL" ? "Todas" : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <th className="px-4 py-3">Aluno</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((req) => (
              <motion.tr
                key={req.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white text-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{req.student}</p>
                    <p className="text-xs text-zinc-400">{req.studentEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{req.title}</td>
                <td className="px-4 py-3 text-zinc-500">{req.type}</td>
                <td className="px-4 py-3 text-zinc-500">{req.date}</td>
                <td className="px-4 py-3">
                  <Badge className={statusConfig[req.status].class}>
                    {req.status === "APPROVED" && <Check size={10} className="mr-1" />}
                    {req.status === "REJECTED" && <X size={10} className="mr-1" />}
                    {req.status === "PENDING" && <Clock size={10} className="mr-1" />}
                    {statusConfig[req.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye size={14} />
                  </Button>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-400">
                  Nenhuma verificação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
