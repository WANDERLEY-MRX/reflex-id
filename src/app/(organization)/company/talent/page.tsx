"use client"

import { useState } from "react"
import { TalentSearch } from "@/components/organization/talent-search"
import type { TalentFilters } from "@/components/organization/talent-search"

const mockTalents = [
  { id: "1", name: "Lucas Almeida", email: "lucas@email.com", confidenceLevel: "HIGH" as const, badges: [{ name: "React Expert", level: "GOLD" }], skills: ["React", "TypeScript"], location: "São Paulo, SP", age: 28 },
  { id: "2", name: "Sofia Martins", email: "sofia@email.com", confidenceLevel: "VERY_HIGH" as const, badges: [{ name: "Top Designer", level: "PLATINUM" }], skills: ["Figma", "Design"], location: "Rio de Janeiro, RJ", age: 25 },
  { id: "3", name: "Rafael Costa", email: "rafael@email.com", confidenceLevel: "MEDIUM" as const, badges: [], skills: ["Python", "SQL"], location: "Belo Horizonte, MG", age: 32 },
  { id: "4", name: "Beatriz Lima", email: "beatriz@email.com", confidenceLevel: "HIGH" as const, badges: [{ name: "Comunicação", level: "SILVER" }], skills: ["Marketing", "Comunicação"], location: "Curitiba, PR", age: 27 },
  { id: "5", name: "Gabriel Oliveira", email: "gabriel@email.com", confidenceLevel: "LOW" as const, badges: [], skills: ["Java"], location: "Porto Alegre, RS", age: 22 },
  { id: "6", name: "Marina Santos", email: "marina@email.com", confidenceLevel: "VERY_HIGH" as const, badges: [{ name: "Liderança", level: "GOLD" }, { name: "Inovação", level: "PLATINUM" }], skills: ["Liderança", "Trabalho em Equipe"], location: "Brasília, DF", age: 30 },
]

export default function TalentPage() {
  const [talents, setTalents] = useState(mockTalents)

  function handleSearch(filters: TalentFilters) {
    const filtered = mockTalents.filter((t) => {
      if (filters.query) {
        const q = filters.query.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q) && !t.skills.some((s) => s.toLowerCase().includes(q))) {
          return false
        }
      }
      if (filters.confidenceLevel && t.confidenceLevel !== filters.confidenceLevel) return false
      if (filters.location && !t.location?.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minAge && t.age && t.age < parseInt(filters.minAge)) return false
      if (filters.maxAge && t.age && t.age > parseInt(filters.maxAge)) return false
      if (filters.skills.length > 0 && !filters.skills.some((s) => t.skills.includes(s))) return false
      return true
    })
    setTalents(filtered)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Buscar Talentos</h1>
        <p className="text-sm text-zinc-500">
          Encontre os melhores candidatos verificados para sua empresa
        </p>
      </div>
      <TalentSearch talents={talents} onSearch={handleSearch} />
    </div>
  )
}
