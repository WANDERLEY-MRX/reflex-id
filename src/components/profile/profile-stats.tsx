"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, ShieldCheck, FolderGit2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileStatsProps {
  views?: number
  verifications?: number
  projects?: number
  achievements?: number
  className?: string
}

function ProfileStats({ views, verifications, projects, achievements, className }: ProfileStatsProps) {
  const stats = [
    { icon: <Eye className="h-4 w-4" />, value: views, label: "Visualizações" },
    { icon: <ShieldCheck className="h-4 w-4" />, value: verifications, label: "Verificações" },
    { icon: <FolderGit2 className="h-4 w-4" />, value: projects, label: "Projetos" },
    { icon: <Trophy className="h-4 w-4" />, value: achievements, label: "Conquistas" },
  ]

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <div className="text-primary">{stat.icon}</div>
              <p className="text-xl font-bold">{stat.value ?? "-"}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export { ProfileStats }
