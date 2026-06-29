"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  title?: string
  message?: string
  retry?: () => void
  className?: string
  fullScreen?: boolean
}

function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  retry,
  className,
  fullScreen = true,
}: ErrorPageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-4 text-center",
        fullScreen ? "fixed inset-0 z-50 bg-background" : "py-20",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {retry && (
        <Button variant="primary" size="sm" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  )
}

function ErrorSection({ message, retry }: { message?: string; retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <p className="text-sm text-muted-foreground">{message || "Failed to load"}</p>
      {retry && (
        <Button variant="ghost" size="sm" onClick={retry}>
          Retry
        </Button>
      )}
    </div>
  )
}

export { ErrorPage, ErrorSection }
