"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle2, XCircle, AlertCircle, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

type VerificationStepStatus = "pending" | "in_progress" | "approved" | "rejected"

interface VerificationStep {
  status: VerificationStepStatus
  label: string
  description?: string
  date?: Date | string
  actor?: string
}

interface VerificationTimelineProps {
  steps: VerificationStep[]
  className?: string
}

const stepIcons: Record<VerificationStepStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  in_progress: <AlertCircle className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
}

const stepColors: Record<VerificationStepStatus, string> = {
  pending: "text-muted-foreground border-muted-foreground/30",
  in_progress: "text-amber-600 dark:text-amber-400 border-amber-500/50",
  approved: "text-emerald-600 dark:text-emerald-400 border-emerald-500/50",
  rejected: "text-red-600 dark:text-red-400 border-red-500/50",
}

const stepBgColors: Record<VerificationStepStatus, string> = {
  pending: "bg-muted",
  in_progress: "bg-amber-500/10",
  approved: "bg-emerald-500/10",
  rejected: "bg-red-500/10",
}

function VerificationTimeline({ steps, className }: VerificationTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="relative flex gap-3 pb-6 last:pb-0"
        >
          <div className="flex flex-col items-center">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border-2",
              stepColors[step.status],
              stepBgColors[step.status]
            )}>
              {stepIcons[step.status]}
            </div>
            {i < steps.length - 1 && (
              <div className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium",
                step.status === "rejected" ? "text-red-600 dark:text-red-400" : "text-foreground"
              )}>
                {step.label}
              </span>
              {step.status === "in_progress" && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>

            {step.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
            )}

            <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
              {step.date && <span>{formatDate(step.date)}</span>}
              {step.actor && (
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  {step.actor}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export { VerificationTimeline }
