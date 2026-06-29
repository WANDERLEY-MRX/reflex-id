"use client"

import * as React from "react"
import { MoreHorizontal, Download, ExternalLink, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface TimelineItemAttachment {
  name: string
  url: string
}

interface TimelineItemProps {
  icon: React.ReactNode
  title: string
  description?: string
  date: Date | string
  category?: string
  actions?: { label: string; onClick: () => void }[]
  attachments?: TimelineItemAttachment[]
  className?: string
}

const categoryColors: Record<string, string> = {
  evidence: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  verification: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  project: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  skill: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  achievement: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

function TimelineItem({ icon, title, description, date, category, actions, attachments, className }: TimelineItemProps) {
  return (
    <div className={cn("relative flex gap-4 pl-10", className)}>
      <div className={cn(
        "absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-secondary text-secondary-foreground",
        category && categoryColors[category]
      )}>
        <span className="scale-[0.6]">{icon}</span>
      </div>

      <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium truncate">{title}</h4>
              {category && (
                <Badge variant="default" size="sm" className="shrink-0 capitalize">{category}</Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(date)}</p>
          </div>

          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, i) => (
                  <DropdownMenuItem key={i} onClick={action.onClick}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {description && (
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}

        {attachments && attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {attachments.map((att, i) => (
              <a
                key={i}
                href={att.url}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <Paperclip className="h-3 w-3" />
                {att.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { TimelineItem }
