"use client"

import * as React from "react"
import { AlertTriangle, Trash2, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ConfirmVariant = "danger" | "warning"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void
  onCancel?: () => void
  loading?: boolean
  className?: string
}

const variantConfig: Record<ConfirmVariant, { icon: React.ReactNode; buttonVariant: "danger" | "primary" }> = {
  danger: {
    icon: <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />,
    buttonVariant: "danger",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    buttonVariant: "primary",
  },
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
  className,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              variant === "danger" ? "bg-red-500/10" : "bg-amber-500/10"
            )}>
              {config.icon}
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            <Ban className="h-4 w-4 mr-1.5" />
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {variant === "danger" && <Trash2 className="h-4 w-4 mr-1.5" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
