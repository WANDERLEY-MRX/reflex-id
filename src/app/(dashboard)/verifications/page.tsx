"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  GraduationCap,
  Users,
  Plus,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type VerificationType = "school" | "company" | "mentor"

interface Verification {
  id: string
  type: VerificationType
  name: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt?: string
}

const typeConfig = {
  school: { label: "Escola/Universidade", icon: GraduationCap },
  company: { label: "Empresa", icon: Building2 },
  mentor: { label: "Mentor", icon: Users },
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    class:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle,
    class:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  rejected: {
    label: "Rejeitado",
    icon: XCircle,
    class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
}

const initialVerifications: Verification[] = [
  {
    id: "1",
    type: "school",
    name: "Universidade Federal",
    status: "approved",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-15",
  },
  {
    id: "2",
    type: "company",
    name: "Tech Corp",
    status: "pending",
    createdAt: "2024-03-01",
  },
  {
    id: "3",
    type: "mentor",
    name: "Carlos Silva",
    status: "rejected",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25",
  },
]

export default function VerificationsPage() {
  const [verifications, setVerifications] =
    useState<Verification[]>(initialVerifications)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newRequest, setNewRequest] = useState({
    type: "school" as VerificationType,
    name: "",
    email: "",
  })

  async function submitRequest() {
    if (!newRequest.name.trim() || !newRequest.email.trim()) {
      toast.error("Preencha todos os campos")
      return
    }
    setIsLoading(true)
    try {
      setVerifications((prev) => [
        {
          id: crypto.randomUUID(),
          type: newRequest.type,
          name: newRequest.name.trim(),
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ])
      setNewRequest({ type: "school", name: "", email: "" })
      setIsAdding(false)
      toast.success("Solicitação de verificação enviada!")
    } catch {
      toast.error("Erro ao enviar solicitação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verificações</h1>
          <p className="text-sm text-zinc-500">
            Solicite e acompanhe verificações de credenciais
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={16} /> Nova Solicitação
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">
            Solicitar Verificação
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  Object.entries(typeConfig) as [
                    VerificationType,
                    { label: string; icon: typeof Building2 },
                  ][]
                ).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setNewRequest((prev) => ({ ...prev, type }))
                      }
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors",
                        newRequest.type === type
                          ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                          : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
                      )}
                    >
                      <Icon size={20} />
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nome da {typeConfig[newRequest.type].label}
              </label>
              <input
                autoFocus
                value={newRequest.name}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={`Nome da ${typeConfig[newRequest.type].label.toLowerCase()}`}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                Email de contato
              </label>
              <input
                type="email"
                value={newRequest.email}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="contato@exemplo.com"
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={submitRequest}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                Solicitar Verificação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { status: "approved", label: "Aprovadas", icon: CheckCircle },
          { status: "pending", label: "Pendentes", icon: Clock },
          { status: "rejected", label: "Rejeitadas", icon: XCircle },
        ] as const).map(({ status, label, icon: Icon }) => {
          const count = verifications.filter(
            (v) => v.status === status,
          ).length
          return (
            <div
              key={status}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-zinc-400" />
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{count}</p>
            </div>
          )
        })}
      </div>

      {/* History */}
      <div className="space-y-3">
        {verifications.map((v) => {
          const typeInfo = typeConfig[v.type]
          const TypeIcon = typeInfo.icon
          const statusInfo = statusConfig[v.status]
          const StatusIcon = statusInfo.icon

          return (
            <div
              key={v.id}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <TypeIcon size={20} className="text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{v.name}</p>
                <p className="text-xs text-zinc-500">
                  {typeInfo.label} · Solicitado em{" "}
                  {new Date(v.createdAt).toLocaleDateString("pt-BR")}
                  {v.updatedAt &&
                    ` · Atualizado em ${new Date(v.updatedAt).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusInfo.class,
                )}
              >
                <StatusIcon size={12} />
                {statusInfo.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
