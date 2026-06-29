"use client"

import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Mail, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ConfidenceLevel } from "@/constants"

export interface StudentCardProps {
  id: string
  name: string
  email: string
  avatar?: string
  confidenceLevel: ConfidenceLevel
  badges: { name: string; level: string }[]
  grade?: string
  class?: string
  onView?: (id: string) => void
  onVerify?: (id: string) => void
  className?: string
}

const confidenceColor: Record<ConfidenceLevel, string> = {
  LOW: "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400",
  MEDIUM: "text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  HIGH: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400",
  VERY_HIGH: "text-violet-600 bg-violet-100 dark:bg-violet-950 dark:text-violet-400",
}

const confidenceLevelLabel: Record<ConfidenceLevel, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  VERY_HIGH: "Muito Alta",
}

export function StudentCard({
  id,
  name,
  email,
  avatar,
  confidenceLevel,
  badges,
  grade,
  class: turma,
  onView,
  onVerify,
  className,
}: StudentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar src={avatar} fallback={name.charAt(0)} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold truncate">{name}</h3>
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                confidenceColor[confidenceLevel],
              )}
            >
              <ShieldCheck size={12} />
              {confidenceLevelLabel[confidenceLevel]}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <Mail size={12} />
            <span className="truncate">{email}</span>
          </div>
          {(grade || turma) && (
            <p className="mt-1 text-xs text-zinc-400">
              {grade && `${grade}º ano`}{grade && turma && " · "}{turma && `Turma ${turma}`}
            </p>
          )}
          {badges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {badges.map((badge) => (
                <Badge key={badge.name} variant="info" size="sm">
                  {badge.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <Button variant="ghost" size="sm" onClick={() => onView?.(id)}>
          <ExternalLink size={14} />
          Perfil
        </Button>
        <Button variant="outline" size="sm" onClick={() => onVerify?.(id)} className="ml-auto">
          <TrendingUp size={14} />
          Verificar
        </Button>
      </div>
    </motion.div>
  )
}
