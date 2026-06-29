"use client"

import { Trophy, Lock, ShieldCheck, Star, Award, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Badge {
  id: string
  name: string
  description: string
  icon: typeof Trophy
  unlocked: boolean
  progress?: number
  unlockedAt?: string
}

const badges: Badge[] = [
  {
    id: "1",
    name: "Perfil Completo",
    description: "Preencha todas as seções do seu perfil",
    icon: ShieldCheck,
    unlocked: true,
    unlockedAt: "2024-03-10",
  },
  {
    id: "2",
    name: "Primeira Evidência",
    description: "Adicione sua primeira evidência verificada",
    icon: Award,
    unlocked: true,
    unlockedAt: "2024-03-12",
  },
  {
    id: "3",
    name: "Mestre das Habilidades",
    description: "Adicione 10 habilidades ao seu perfil",
    icon: Star,
    unlocked: false,
    progress: 7,
  },
  {
    id: "4",
    name: "Verificado",
    description: "Tenha 3 evidências verificadas",
    icon: ShieldCheck,
    unlocked: false,
    progress: 1,
  },
  {
    id: "5",
    name: "Networker",
    description: "Conecte-se com 50 pessoas",
    icon: Zap,
    unlocked: false,
    progress: 12,
  },
  {
    id: "6",
    name: "Projetos em Série",
    description: "Adicione 5 projetos ao portfólio",
    icon: Trophy,
    unlocked: false,
    progress: 2,
  },
]

const levelThresholds = [
  { level: 1, name: "Iniciante", minXP: 0, color: "text-zinc-500" },
  { level: 2, name: "Bronze", minXP: 100, color: "text-amber-700" },
  { level: 3, name: "Prata", minXP: 300, color: "text-zinc-400" },
  { level: 4, name: "Ouro", minXP: 600, color: "text-yellow-500" },
  { level: 5, name: "Diamante", minXP: 1000, color: "text-cyan-500" },
]

export default function AchievementsPage() {
  const currentXP = 250
  const currentLevel = 2
  const nextLevel = levelThresholds[currentLevel]
  const nextLevelXP = nextLevel?.minXP ?? 1000
  const prevLevelXP = levelThresholds[currentLevel - 1]?.minXP ?? 0
  const progressPercent =
    ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Conquistas</h1>
        <p className="text-sm text-zinc-500">
          Badges e progresso no Reflex ID
        </p>
      </div>

      {/* Level Card */}
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-white p-6 dark:from-violet-950 dark:to-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              <span
                className={cn(
                  "text-lg font-bold",
                  levelThresholds[currentLevel]?.color,
                )}
              >
                Nível {currentLevel} -{" "}
                {levelThresholds[currentLevel]?.name ?? "Desconhecido"}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              {currentXP} XP · Próximo nível em{" "}
              {nextLevelXP - currentXP} XP
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
            <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {currentLevel}
            </span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-2 rounded-full bg-violet-500 transition-all"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        <div className="mt-6 flex gap-4">
          {levelThresholds.map((lt) => (
            <div
              key={lt.level}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                lt.level <= currentLevel
                  ? lt.color
                  : "text-zinc-300 dark:text-zinc-600",
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  lt.level <= currentLevel
                    ? "bg-current"
                    : "bg-zinc-300 dark:bg-zinc-600",
                )}
              />
              Nv {lt.level}
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.id}
                className={cn(
                  "rounded-xl border p-5 transition-all",
                  badge.unlocked
                    ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    : "border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      badge.unlocked
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
                        : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600",
                    )}
                  >
                    {badge.unlocked ? (
                      <Icon size={20} />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        badge.unlocked
                          ? "text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-400",
                      )}
                    >
                      {badge.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {!badge.unlocked && badge.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Progresso</span>
                      <span>{badge.progress}/10</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-1.5 rounded-full bg-violet-500"
                        style={{
                          width: `${(badge.progress / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {badge.unlocked && badge.unlockedAt && (
                  <p className="mt-2 text-xs text-zinc-400">
                    Conquistado em{" "}
                    {new Date(badge.unlockedAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
