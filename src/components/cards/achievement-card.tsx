"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

interface AchievementCardProps {
  icon: React.ReactNode
  name: string
  description?: string
  date?: Date | string
  rarity: Rarity
  className?: string
}

const rarityConfig: Record<Rarity, { label: string; className: string }> = {
  common: { label: "Comum", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
  uncommon: { label: "Incomum", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  rare: { label: "Raro", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  epic: { label: "Épico", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  legendary: { label: "Lendário", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
}

function AchievementCard({ icon, name, description, date, rarity, className }: AchievementCardProps) {
  const rarityStyles = rarityConfig[rarity]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("group", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-lg", rarityStyles.className)}>
              {icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate">{name}</h4>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", rarityStyles.className)}>
                  {rarityStyles.label}
                </span>
              </div>
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
              )}
              {date && (
                <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(date)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { AchievementCard }
