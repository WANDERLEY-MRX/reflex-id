"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentCard } from "@/components/organization/student-card"

const allStudents = [
  { id: "1", name: "Ana Beatriz Silva", email: "ana.silva@escola.edu", confidenceLevel: "HIGH" as const, badges: [{ name: "Destaque", level: "GOLD" }], grade: "3", class: "A" },
  { id: "2", name: "Carlos Eduardo Lima", email: "carlos.lima@escola.edu", confidenceLevel: "MEDIUM" as const, badges: [], grade: "2", class: "B" },
  { id: "3", name: "Mariana Oliveira", email: "mariana.oliveira@escola.edu", confidenceLevel: "VERY_HIGH" as const, badges: [{ name: "Excelência", level: "PLATINUM" }], grade: "3", class: "A" },
  { id: "4", name: "Pedro Henrique Santos", email: "pedro.santos@escola.edu", confidenceLevel: "LOW" as const, badges: [], grade: "1", class: "C" },
  { id: "5", name: "Julia Costa", email: "julia.costa@escola.edu", confidenceLevel: "HIGH" as const, badges: [{ name: "Participação", level: "SILVER" }], grade: "2", class: "A" },
  { id: "6", name: "Lucas Almeida", email: "lucas.almeida@escola.edu", confidenceLevel: "MEDIUM" as const, badges: [], grade: "1", class: "B" },
  { id: "7", name: "Sofia Martins", email: "sofia.martins@escola.edu", confidenceLevel: "HIGH" as const, badges: [{ name: "Liderança", level: "GOLD" }], grade: "3", class: "B" },
  { id: "8", name: "Rafael Oliveira", email: "rafael.oliveira@escola.edu", confidenceLevel: "LOW" as const, badges: [], grade: "2", class: "C" },
]

export default function StudentsPage() {
  const [search, setSearch] = useState("")
  const [filterGrade, setFilterGrade] = useState("")

  const filtered = allStudents.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchGrade = !filterGrade || s.grade === filterGrade
    return matchSearch && matchGrade
  })

  const grades = [...new Set(allStudents.map((s) => s.grade))].sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alunos</h1>
          <p className="text-sm text-zinc-500">{allStudents.length} alunos vinculados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={14} />
            Exportar
          </Button>
          <Button size="sm">
            <Plus size={14} />
            Adicionar Aluno
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alunos..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGrade(filterGrade === g ? "" : g)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filterGrade === g
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
              )}
            >
              {g}º Ano
            </button>
          ))}
          {filterGrade && (
            <button
              onClick={() => setFilterGrade("")}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StudentCard {...student} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-zinc-400">
            <Search size={48} strokeWidth={1} />
            <p className="text-sm">Nenhum aluno encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
