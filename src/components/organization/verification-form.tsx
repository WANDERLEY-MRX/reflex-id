"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

interface VerificationFormProps {
  studentName?: string
  studentId?: string
  onSubmit?: (data: VerificationFormData) => Promise<void>
  onCancel?: () => void
  className?: string
}

export interface VerificationFormData {
  studentId: string
  type: string
  title: string
  description: string
  document?: File
}

const verificationTypes = [
  { value: "academic", label: "Desempenho Acadêmico" },
  { value: "behavior", label: "Comportamento" },
  { value: "attendance", label: "Frequência" },
  { value: "skill", label: "Competência Técnica" },
  { value: "project", label: "Projeto Realizado" },
  { value: "other", label: "Outro" },
]

export function VerificationForm({
  studentName,
  studentId: initialStudentId,
  onSubmit,
  onCancel,
  className,
}: VerificationFormProps) {
  const [studentId, setStudentId] = useState(initialStudentId || "")
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId || !type || !title) {
      setError("Preencha todos os campos obrigatórios")
      return
    }
    setLoading(true)
    setError("")
    try {
      await onSubmit?.({ studentId, type, title, description })
      setSuccess(true)
      setStudentId("")
      setType("")
      setTitle("")
      setDescription("")
    } catch {
      setError("Erro ao enviar verificação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900", className)}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Check size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold">Verificação Enviada</h3>
            <p className="text-sm text-zinc-500 text-center">
              A verificação será processada em breve
            </p>
            <Button variant="outline" onClick={() => setSuccess(false)}>
              Nova Verificação
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Emitir Verificação</h3>
              {studentName && (
                <span className="text-sm text-zinc-500">para {studentName}</span>
              )}
            </div>

            <Input
              label="ID do Aluno"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="ID do estudante"
              disabled={!!initialStudentId}
            />

            <Select
              label="Tipo de Verificação"
              options={verificationTypes}
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Selecione o tipo"
            />

            <Input
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Certificado de conclusão"
            />

            <Textarea
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da verificação..."
              rows={3}
            />

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <X size={14} />
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" loading={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Emitir Verificação
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
