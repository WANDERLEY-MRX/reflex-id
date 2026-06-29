"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, UserCheck, Award, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

interface Activity {
  id: string
  type: "evidence" | "verification" | "achievement" | "system"
  title: string
  description?: string
  date: Date | string
  user?: { name: string; avatar?: string }
}

interface RecentActivityProps {
  activities: Activity[]
  className?: string
}

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  evidence: <FileText className="h-3.5 w-3.5" />,
  verification: <UserCheck className="h-3.5 w-3.5" />,
  achievement: <Award className="h-3.5 w-3.5" />,
  system: <AlertCircle className="h-3.5 w-3.5" />,
}

const activityColors: Record<Activity["type"], string> = {
  evidence: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  verification: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  achievement: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  system: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
}

function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma atividade recente</p>
        ) : (
          activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
            >
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full shrink-0", activityColors[activity.type])}>
                {activityIcons[activity.type]}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.user && (
                    <Avatar src={activity.user.avatar} fallback={activity.user.name} size="sm" className="h-5 w-5 ml-auto shrink-0" />
                  )}
                </div>
                {activity.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground">{formatRelativeTime(activity.date)}</p>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export { RecentActivity }
