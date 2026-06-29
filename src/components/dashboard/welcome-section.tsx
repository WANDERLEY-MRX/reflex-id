"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WelcomeSectionProps {
  name: string
  progress?: number
  className?: string
}

function WelcomeSection({ name, progress, className }: WelcomeSectionProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="absolute right-4 top-4 text-primary/10">
            <Sparkles className="h-16 w-16" />
          </div>

          <div className="relative">
            <h1 className="text-xl font-bold">
              {greeting}, {name}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Bem-vindo(a) ao seu painel Reflex ID
            </p>

            {progress != null && (
              <div className="mt-4 max-w-sm">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso do perfil</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} variant={progress >= 80 ? "success" : progress >= 50 ? "warning" : "default"} size="md" />
                {progress >= 80 && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    Perfil completo! Ótimo trabalho.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { WelcomeSection }
