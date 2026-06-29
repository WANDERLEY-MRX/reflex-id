"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva("h-full w-full rounded-full transition-all duration-500", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface ProgressProps extends VariantProps<typeof progressVariants> {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

function Progress({ value, max = 100, variant, className, showLabel, size = "md" }: ProgressProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 overflow-hidden rounded-full bg-secondary",
          size === "sm" && "h-1.5",
          size === "md" && "h-2",
          size === "lg" && "h-3"
        )}
      >
        <div
          className={cn(progressVariants({ variant }))}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{percentage}%</span>
      )}
    </div>
  )
}

export { Progress }
