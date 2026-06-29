"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { useLocalAuth } from "@/providers/local-auth-provider"
import {
  getEvidencesByUserId,
  addEvidence as addEvidenceDb,
  type LocalEvidence,
} from "@/lib/local-db"

type EvidenceType = "pdf" | "image" | "video" | "link"

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

export default function EvidencesPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useLocalAuth()
  const [evidences, setEvidences] = useState<LocalEvidence[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newEvidence, setNewEvidence] = useState({
    title: "",
    type: "pdf" as EvidenceType,
    url: "",
  })

  useEffect(() => {
    if (!authLoading && !session) router.push("/login")
  }, [session, authLoading, router])

  useEffect(() => {
    if (session) setEvidences(getEvidencesByUserId(session.user.id))
  }, [session])

  function reload() {
    if (session) setEvidences(getEvidencesByUserId(session.user.id))
  }

  async function addEvidence() {
    if (!newEvidence.title.trim() || !session) return
    setIsLoading(true)
    try {
      addEvidenceDb(session.user.id, {
        title: newEvidence.title.trim(),
        description: null,
        type: newEvidence.type.toUpperCase(),
        verificationStatus: "PENDING",
        confidenceLevel: "MEDIUM",
        source: "Self",
        fileUrl: newEvidence.url || null,
      })
      setNewEvidence({ title: "", type: "pdf", url: "" })
      setIsAdding(false)
      reload()
      toast.success("Evidência adicionada!")
    } catch {
      toast.error("Erro ao adicionar evidência")
    } finally {
      setIsLoading(false)
    }
  }

  function getStatusDisplay(status: string) {
    switch (status) {
      case "VERIFIED":
        return { label: "Verificado", class: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", icon: ShieldCheck }
      case "REJECTED":
        return { label: "Rejeitado", class: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", icon: X }
      default:
        return { label: "Pendente", class: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", icon: Clock }
    }
  }

  function getEvidenceType(raw: string): EvidenceType {
    const lower = raw.toLowerCase()
    if (lower.includes("pdf")) return "pdf"
    if (lower.includes("image") || lower.includes("image")) return "image"
    if (lower.includes("video")) return "video"
    if (lower.includes("link")) return "link"
    return "pdf"
  }

  if (authLoading || !session) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin" /></div>
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

      {evidences.length === 0 && !isAdding && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-700">
          <FileText size={48} className="mx-auto text-zinc-300 dark:text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-500">
            Nenhuma evidência adicionada ainda
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
          >
            Adicionar primeira evidência
          </button>
        </div>
      )}

      {evidences.map((evidence) => {
        const evType = getEvidenceType(evidence.type)
        const Icon = typeIcons[evType]
        const status = getStatusDisplay(evidence.verificationStatus)
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
                      {typeLabels[evType]} ·{" "}
                      {new Date(evidence.createdAt).toLocaleDateString("pt-BR")}
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
                  {evidence.source && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Origem: {evidence.source}
                    </span>
                  )}
                </div>

                {evidence.fileUrl && (
                  <div className="mt-3">
                    <a
                      href={evidence.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
                    >
                      <Link2 size={12} /> Abrir link
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
