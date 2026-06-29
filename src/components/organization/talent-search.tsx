"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, X, MapPin, Calendar, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { StudentCard } from "./student-card"

export interface TalentFilters {
  query: string
  skills: string[]
  confidenceLevel: string
  location: string
  minAge: string
  maxAge: string
}

interface Talent {
  id: string
  name: string
  email: string
  avatar?: string
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  badges: { name: string; level: string }[]
  skills: string[]
  location?: string
  age?: number
}

interface TalentSearchProps {
  talents?: Talent[]
  onSearch?: (filters: TalentFilters) => void
  className?: string
}

const skillOptions = [
  "React", "TypeScript", "Python", "Java", "Design", "Marketing",
  "Comunicação", "Liderança", "Trabalho em Equipe", "Inglês",
]

export function TalentSearch({ talents = [], onSearch, className }: TalentSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<TalentFilters>({
    query: "",
    skills: [],
    confidenceLevel: "",
    location: "",
    minAge: "",
    maxAge: "",
  })

  function updateFilter(key: keyof TalentFilters, value: string | string[]) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onSearch?.(next)
  }

  function toggleSkill(skill: string) {
    const next = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill]
    updateFilter("skills", next)
  }

  function clearFilters() {
    const cleared: TalentFilters = {
      query: "",
      skills: [],
      confidenceLevel: "",
      location: "",
      minAge: "",
      maxAge: "",
    }
    setFilters(cleared)
    onSearch?.(cleared)
  }

  const hasFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== "",
  )

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            placeholder="Buscar por nome, email, habilidades..."
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button
          variant={showFilters ? "primary" : "outline"}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {hasFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] text-white">
              {filters.skills.length + (filters.confidenceLevel ? 1 : 0) + (filters.location ? 1 : 0) + (filters.minAge || filters.maxAge ? 1 : 0)}
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X size={14} />
            Limpar
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Nível de Confiança</label>
                  <Select
                    options={[
                      { value: "", label: "Todos" },
                      { value: "VERY_HIGH", label: "Muito Alta" },
                      { value: "HIGH", label: "Alta" },
                      { value: "MEDIUM", label: "Média" },
                      { value: "LOW", label: "Baixa" },
                    ]}
                    value={filters.confidenceLevel}
                    onChange={(e) => updateFilter("confidenceLevel", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Localização</label>
                  <Input
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    placeholder="Cidade, Estado"
                    icon={<MapPin size={14} />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Idade Mínima</label>
                  <Input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => updateFilter("minAge", e.target.value)}
                    placeholder="18"
                    icon={<Calendar size={14} />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Idade Máxima</label>
                  <Input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => updateFilter("maxAge", e.target.value)}
                    placeholder="99"
                    icon={<Calendar size={14} />}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Competências</label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        filters.skills.includes(skill)
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filters.skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Filtros ativos:</span>
          {filters.skills.map((skill) => (
            <Badge key={skill} variant="info" size="sm">
              {skill}
              <button onClick={() => toggleSkill(skill)} className="ml-1">
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {talents.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-zinc-400">
            <Search size={48} strokeWidth={1} />
            <p className="text-sm">Nenhum talento encontrado</p>
            <p className="text-xs">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          talents.map((talent) => (
            <StudentCard
              key={talent.id}
              id={talent.id}
              name={talent.name}
              email={talent.email}
              avatar={talent.avatar}
              confidenceLevel={talent.confidenceLevel}
              badges={talent.badges}
            />
          ))
        )}
      </div>
    </div>
  )
}
