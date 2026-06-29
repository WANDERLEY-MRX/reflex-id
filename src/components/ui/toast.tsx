"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

function toast({ title, description, action }: ToastProps) {
  return sonnerToast(title, {
    description,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  })
}

toast.success = (message: string, opts?: ToastProps) => {
  return sonnerToast.success(message, opts)
}

toast.error = (message: string, opts?: ToastProps) => {
  return sonnerToast.error(message, opts)
}

toast.warning = (message: string, opts?: ToastProps) => {
  return sonnerToast.warning(message, opts)
}

toast.info = (message: string, opts?: ToastProps) => {
  return sonnerToast.info(message, opts)
}

toast.loading = (message: string, opts?: ToastProps) => {
  return sonnerToast.loading(message, opts)
}

toast.dismiss = (id?: string | number) => {
  return sonnerToast.dismiss(id)
}

toast.promise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) => {
  return sonnerToast.promise(promise, messages)
}

export { toast }
