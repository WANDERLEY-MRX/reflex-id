"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, Download, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Candidate {
  id: string
  name: string
  email: string
  confidenceLevel: string
  status: "active" | "reviewing" | "placed" | "archived"
  lastContact: string
}

const allCandidates: Candidate[] = [
  { id: "1", name: "Ana Beatriz Silva", email: "ana@email.com", confidenceLevel: "HIGH", status: "active", lastContact: "2 dias atrás" },
  { id: "2", name: "Carlos Eduardo Lima", email: "carlos@email.com", confidenceLevel: "MEDIUM", status: "reviewing", lastContact: "5 dias atrás" },
  { id: "3", name: "Mariana Oliveira", email: "mariana@email.com", confidenceLevel: "VERY_HIGH", status: "active", lastContact: "1 dia atrás" },
  { id: "4", name: "Pedro Henrique Santos", email: "pedro@email.com", confidenceLevel: "LOW", status: "archived", lastContact: "1 mês atrás" },
  { id: "5", name: "Julia Costa", email: "julia@email.com", confidenceLevel: "HIGH", status: "placed", lastContact: "3 dias atrás" },
  { id: "6", name: "Lucas Almeida", email: "lucas@email.com", confidenceLevel: "MEDIUM", status: "active", lastContact: "hoje" },
  { id: "7", name: "Sofia Martins", email: "sofia@email.com", confidenceLevel: "VERY_HIGH", status: "reviewing", lastContact: "4 dias atrás" },
  { id: "8", name: "Rafael Oliveira", email: "rafael@email.com", confidenceLevel: "LOW", status: "archived", lastContact: "2 meses atrás" },
]

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Ativo", class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  reviewing: { label: "Em Análise", class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  placed: { label: "Alocado", class: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" },
  archived: { label: "Arquivado", class: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" },
}

const confidenceColor: Record<string, string> = {
  VERY_HIGH: "text-violet-600",
  HIGH: "text-emerald-600",
  MEDIUM: "text-amber-600",
  LOW: "text-red-600",
}

export default function CandidatesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const filtered = allCandidates.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <p className="text-sm text-zinc-500">{allCandidates.length} candidatos acompanhados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={14} />
            Exportar
          </Button>
          <Button size="sm">
            <Plus size={14} />
            Adicionar Candidato
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar candidatos..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["ALL", "active", "reviewing", "placed", "archived"] as const).map((status) => (
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
              {status === "ALL" ? "Todos" : statusConfig[status].label}
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
              <th className="px-4 py-3">Candidato</th>
              <th className="px-4 py-3">Confiança</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Último Contato</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((candidate) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white text-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={candidate.name.charAt(0)} size="sm" />
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-xs text-zinc-400">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-semibold", confidenceColor[candidate.confidenceLevel])}>
                    {candidate.confidenceLevel === "VERY_HIGH" ? "Muito Alta" :
                     candidate.confidenceLevel === "HIGH" ? "Alta" :
                     candidate.confidenceLevel === "MEDIUM" ? "Média" : "Baixa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusConfig[candidate.status].class} size="sm">
                    {statusConfig[candidate.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{candidate.lastContact}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                      <DropdownMenuItem>Solicitar Verificação</DropdownMenuItem>
                      <DropdownMenuItem>Enviar Mensagem</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Arquivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-zinc-400">
                  Nenhum candidato encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
