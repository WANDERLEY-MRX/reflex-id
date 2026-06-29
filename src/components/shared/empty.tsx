"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"

interface EmptyPageProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function EmptyPage({
  icon,
  title = "No data",
  description = "There is nothing here yet.",
  action,
  className,
}: EmptyPageProps) {
  return (
    <div className={cn("py-20", className)}>
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        action={action}
      />
    </div>
  )
}

export { EmptyPage }
