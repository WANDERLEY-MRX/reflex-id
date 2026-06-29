"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingPageProps {
  message?: string
  className?: string
  fullScreen?: boolean
}

function LoadingPage({ message = "Loading...", className, fullScreen = true }: LoadingPageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen ? "fixed inset-0 z-50 bg-background" : "py-20",
        className
      )}
    >
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}

function LoadingSection({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <LoadingSpinner size="md" />
    </div>
  )
}

export { LoadingPage, LoadingSection }
