"use client"

import { useState } from "react"
import { Plus, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type SkillCategory = "soft" | "hard" | "language"

interface Skill {
  id: string
  name: string
  level: number
  category: SkillCategory
  verified: boolean
}

const categoryLabels: Record<SkillCategory, string> = {
  soft: "Soft Skills",
  hard: "Hard Skills",
  language: "Idiomas",
}

const initialSkills: Skill[] = [
  { id: "1", name: "Comunicação", level: 4, category: "soft", verified: true },
  { id: "2", name: "Liderança", level: 3, category: "soft", verified: false },
  {
    id: "3",
    name: "TypeScript",
    level: 5,
    category: "hard",
    verified: true,
  },
  { id: "4", name: "React", level: 4, category: "hard", verified: true },
  { id: "5", name: "Node.js", level: 3, category: "hard", verified: false },
  { id: "6", name: "Inglês", level: 4, category: "language", verified: true },
  { id: "7", name: "Espanhol", level: 2, category: "language", verified: false },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [newSkill, setNewSkill] = useState("")
  const [newLevel, setNewLevel] = useState(3)
  const [newCategory, setNewCategory] = useState<SkillCategory>("hard")
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function addSkill() {
    if (!newSkill.trim()) return
    setIsLoading(true)
    try {
      setSkills((prev) => [
        {
          id: crypto.randomUUID(),
          name: newSkill.trim(),
          level: newLevel,
          category: newCategory,
          verified: false,
        },
        ...prev,
      ])
      setNewSkill("")
      setNewLevel(3)
      setIsAdding(false)
      toast.success("Competência adicionada!")
    } catch {
      toast.error("Erro ao adicionar competência")
    } finally {
      setIsLoading(false)
    }
  }

  function deleteSkill(id: string) {
    setSkills((prev) => prev.filter((s) => s.id !== id))
    toast.success("Competência removida")
  }

  function updateLevel(id: string, level: number) {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, level: Math.max(1, Math.min(5, level)) } : s,
      ),
    )
  }

  const grouped = Object.entries(categoryLabels).map(([cat, label]) => ({
    category: cat as SkillCategory,
    label,
    items: skills.filter((s) => s.category === cat),
  }))

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

      {/* Add Form */}
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

      {/* Skills by Category */}
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
                          onClick={() => updateLevel(skill.id, level)}
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
                      onClick={() => deleteSkill(skill.id)}
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
