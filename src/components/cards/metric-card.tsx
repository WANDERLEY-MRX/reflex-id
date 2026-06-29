"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface SparklineData {
  value: number
  date: string
}

interface MetricCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: number
  sparkline?: SparklineData[]
  className?: string
}

function MetricCard({ icon, value, label, trend, sparkline, className }: MetricCardProps) {
  const trendIcon = trend != null ? (
    trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> :
    trend < 0 ? <TrendingDown className="h-3.5 w-3.5" /> :
    <Minus className="h-3.5 w-3.5" />
  ) : null

  const trendColor = trend != null ? (
    trend > 0 ? "text-emerald-600 dark:text-emerald-400" :
    trend < 0 ? "text-red-600 dark:text-red-400" :
    "text-muted-foreground"
  ) : ""

  const maxSpark = sparkline ? Math.max(...sparkline.map(s => s.value), 1) : 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              {icon}
            </div>
            {trend != null && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
                {trendIcon}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>

          {sparkline && sparkline.length > 0 && (
            <div className="mt-4 flex items-end gap-0.5">
              {sparkline.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/20 dark:bg-primary/10"
                  style={{ height: `${(point.value / maxSpark) * 40}px` }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { MetricCard }
