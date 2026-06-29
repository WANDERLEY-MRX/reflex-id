"use client"

import { useState } from "react"
import {
  Upload,
  FileText,
  Image,
  Video,
  Link2,
  ShieldCheck,
  Clock,
  Hash,
  Download,
  Loader2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type EvidenceType = "pdf" | "image" | "video" | "link"

interface Evidence {
  id: string
  title: string
  type: EvidenceType
  file?: string
  url?: string
  hash: string
  timestamp: string
  origin: string
  status: "pending" | "verified" | "rejected"
}

const typeIcons: Record<EvidenceType, typeof FileText> = {
  pdf: FileText,
  image: Image,
  video: Video,
  link: Link2,
}

const typeLabels: Record<EvidenceType, string> = {
  pdf: "PDF",
  image: "Imagem",
  video: "Vídeo",
  link: "Link",
}

const initialEvidences: Evidence[] = [
  {
    id: "1",
    title: "Diploma de Graduação",
    type: "pdf",
    hash: "sha256:a1b2c3d4e5f6...",
    timestamp: "2024-03-15T10:30:00Z",
    origin: "Universidade Federal",
    status: "verified",
  },
  {
    id: "2",
    title: "Certificado de Curso",
    type: "image",
    hash: "sha256:f6e5d4c3b2a1...",
    timestamp: "2024-02-20T14:00:00Z",
    origin: "Plataforma de Cursos",
    status: "pending",
  },
  {
    id: "3",
    title: "Portfólio Online",
    type: "link",
    url: "https://portfolio.example.com",
    hash: "sha256:9876543210...",
    timestamp: "2024-01-10T09:00:00Z",
    origin: "Self",
    status: "pending",
  },
]

export default function EvidencesPage() {
  const [evidences, setEvidences] = useState<Evidence[]>(initialEvidences)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newEvidence, setNewEvidence] = useState({
    title: "",
    type: "pdf" as EvidenceType,
    url: "",
  })

  async function addEvidence() {
    if (!newEvidence.title.trim()) return
    setIsLoading(true)
    try {
      setEvidences((prev) => [
        {
          id: crypto.randomUUID(),
          title: newEvidence.title.trim(),
          type: newEvidence.type,
          url: newEvidence.url || undefined,
          hash: `sha256:${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}...`,
          timestamp: new Date().toISOString(),
          origin: "Self",
          status: "pending",
        },
        ...prev,
      ])
      setNewEvidence({ title: "", type: "pdf", url: "" })
      setIsAdding(false)
      toast.success("Evidência adicionada!")
    } catch {
      toast.error("Erro ao adicionar evidência")
    } finally {
      setIsLoading(false)
    }
  }

  function requestVerification(id: string) {
    setEvidences((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "pending" as const } : e,
      ),
    )
    toast.success("Solicitação de verificação enviada!")
  }

  const statusConfig = {
    verified: {
      label: "Verificado",
      class:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      icon: ShieldCheck,
    },
    pending: {
      label: "Pendente",
      class: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      icon: Clock,
    },
    rejected: {
      label: "Rejeitado",
      class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      icon: X,
    },
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evidências</h1>
          <p className="text-sm text-zinc-500">
            Documentos e comprovantes verificados
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Upload size={16} /> Nova Evidência
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Adicionar Evidência</h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Título</label>
              <input
                autoFocus
                value={newEvidence.title}
                onChange={(e) =>
                  setNewEvidence((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Diploma, Certificado..."
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={newEvidence.type}
                  onChange={(e) =>
                    setNewEvidence((prev) => ({
                      ...prev,
                      type: e.target.value as EvidenceType,
                    }))
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {newEvidence.type === "link" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">URL</label>
                  <input
                    value={newEvidence.url}
                    onChange={(e) =>
                      setNewEvidence((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                  />
                </div>
              )}
            </div>

            {newEvidence.type !== "link" && (
              <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <Upload size={32} className="mx-auto text-zinc-400" />
                <p className="mt-2 text-sm text-zinc-500">
                  Arraste o arquivo ou clique para selecionar
                </p>
                <p className="text-xs text-zinc-400">
                  PDF, PNG, JPG, WebP, MP4 (máx. 50MB)
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={addEvidence}
                disabled={isLoading || !newEvidence.title.trim()}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence List */}
      {evidences.map((evidence) => {
        const Icon = typeIcons[evidence.type]
        const status = statusConfig[evidence.status]
        const StatusIcon = status.icon

        return (
          <div
            key={evidence.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Icon size={24} className="text-zinc-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{evidence.title}</h3>
                    <p className="text-xs text-zinc-500">
                      {typeLabels[evidence.type]} ·{" "}
                      {new Date(evidence.timestamp).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      status.class,
                    )}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Hash size={12} />
                    {evidence.hash}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Origem: {evidence.origin}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  {evidence.status === "pending" && (
                    <button
                      onClick={() => requestVerification(evidence.id)}
                      className="flex items-center gap-1 rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-300 dark:hover:bg-violet-800"
                    >
                      <ShieldCheck size={12} /> Pedir Verificação
                    </button>
                  )}
                  <button className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
