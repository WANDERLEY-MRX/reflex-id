"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ConfidenceScore } from "@/types"

interface ProfileCardProps {
  photo?: string
  name: string
  slug: string
  headline?: string
  confidence?: ConfidenceScore
  badges?: { name: string; variant?: "success" | "info" | "warning" | "error" }[]
  location?: string
  connections?: number
  className?: string
}

function ProfileCard({ photo, name, slug, headline, confidence, badges, location, connections, className }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("p-5", className)}>
        <div className="flex items-start gap-4">
          <Avatar src={photo} fallback={name} size="lg" />

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight truncate">{name}</h3>
            <p className="text-xs text-muted-foreground">@{slug}</p>
            {headline && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{headline}</p>
            )}
          </div>
        </div>

        {confidence && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Confiança</span>
              <span className="font-medium">{confidence.overall}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
                style={{ width: `${confidence.overall}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {badges?.slice(0, 3).map((badge, i) => (
            <Badge key={i} variant={badge.variant} size="sm">{badge.name}</Badge>
          ))}
          {badges && badges.length > 3 && (
            <Badge variant="default" size="sm">+{badges.length - 3}</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {connections != null && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {connections} conexões
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export { ProfileCard }
