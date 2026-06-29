"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useLocalAuth } from "@/providers/local-auth-provider"
import {
  getSkillsByUserId,
  addSkill as addSkillDb,
  updateSkillLevel,
  removeSkill,
  type LocalSkill,
} from "@/lib/local-db"

type SkillCategory = "soft" | "hard" | "language"

const categoryLabels: Record<SkillCategory, string> = {
  soft: "Soft Skills",
  hard: "Hard Skills",
  language: "Idiomas",
}

export default function SkillsPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useLocalAuth()
  const [skills, setSkills] = useState<LocalSkill[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newLevel, setNewLevel] = useState(3)
  const [newCategory, setNewCategory] = useState<SkillCategory>("hard")
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login")
    }
  }, [session, authLoading, router])

  useEffect(() => {
    if (session) {
      setSkills(getSkillsByUserId(session.user.id))
    }
  }, [session])

  function reload() {
    if (session) setSkills(getSkillsByUserId(session.user.id))
  }

  async function addSkill() {
    if (!newSkill.trim() || !session) return
    setIsLoading(true)
    try {
      addSkillDb(session.user.id, newSkill.trim(), newCategory, newLevel)
      setNewSkill("")
      setNewLevel(3)
      setIsAdding(false)
      reload()
      toast.success("Competência adicionada!")
    } catch {
      toast.error("Erro ao adicionar competência")
    } finally {
      setIsLoading(false)
    }
  }

  function handleDeleteSkill(id: string) {
    removeSkill(id)
    reload()
    toast.success("Competência removida")
  }

  function handleUpdateLevel(id: string, level: number) {
    updateSkillLevel(id, Math.max(1, Math.min(5, level)))
    reload()
  }

  const grouped = Object.entries(categoryLabels).map(([cat, label]) => ({
    category: cat as SkillCategory,
    label,
    items: skills.filter((s) => s.category === cat),
  }))

  if (authLoading || !session) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Competências</h1>
          <p className="text-sm text-zinc-500">
            Gerencie suas habilidades e idiomas
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {isAdding && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1 min-w-[200px]">
              <label className="text-xs font-medium text-zinc-500">
                Nome
              </label>
              <input
                autoFocus
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Nome da competência"
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500">
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
                className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500">
                Nível (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
                className="w-16 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>
            <button
              onClick={addSkill}
              disabled={isLoading || !newSkill.trim()}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {isLoading && <Loader2 size={14} className="animate-spin" />}
              Adicionar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {grouped.map(({ category, label, items }) => (
          <div key={category}>
            <h2 className="mb-3 font-semibold">{label}</h2>
            {items.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Nenhuma competência nesta categoria
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            skill.verified
                              ? "text-green-600 dark:text-green-400"
                              : "text-zinc-400",
                          )}
                        >
                          {skill.verified ? (
                            <>
                              <CheckCircle size={12} /> Verificado
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Não verificado
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleUpdateLevel(skill.id, level)}
                          className={cn(
                            "h-2 w-6 rounded-full transition-colors",
                            level <= skill.level
                              ? "bg-violet-500"
                              : "bg-zinc-200 dark:bg-zinc-700",
                          )}
                          aria-label={`Nível ${level} de 5`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
