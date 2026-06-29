"use client"

import * as React from "react"
import { Shield, ShieldCheck, ShieldAlert, ShieldHalf } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConfidenceLevel = "low" | "medium" | "high" | "very_high"

interface VerificationBadgeProps {
  level: ConfidenceLevel
  showLabel?: boolean
  className?: string
}

const levelConfig: Record<ConfidenceLevel, { label: string; icon: React.ReactNode; className: string }> = {
  low: {
    label: "Baixo",
    icon: <ShieldAlert className="h-full w-full" />,
    className: "text-red-600 dark:text-red-400 bg-red-500/10",
  },
  medium: {
    label: "Médio",
    icon: <ShieldHalf className="h-full w-full" />,
    className: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  high: {
    label: "Alto",
    icon: <ShieldCheck className="h-full w-full" />,
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  very_high: {
    label: "Muito Alto",
    icon: <ShieldCheck className="h-full w-full" />,
    className: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
}

function VerificationBadge({ level, showLabel = true, className }: VerificationBadgeProps) {
  const config = levelConfig[level]

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.className, className)}>
      <span className="h-3.5 w-3.5">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

export { VerificationBadge }
