"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: string
  label: string
  completed: boolean
}

interface ProfileCompletenessProps {
  steps: Step[]
  progress: number
  className?: string
}

function ProfileCompleteness({ steps, progress, className }: ProfileCompletenessProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Complete seu Perfil</CardTitle>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} variant={progress >= 80 ? "success" : progress >= 50 ? "warning" : "default"} size="md" showLabel />

        <div className="space-y-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                step.completed ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {step.completed ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-border text-muted-foreground">
                  <Circle className="h-2.5 w-2.5" />
                </div>
              )}
              <span className={cn("text-sm", step.completed && "line-through")}>{step.label}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { ProfileCompleteness }
