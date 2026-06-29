"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const resetSchema = z
  .object({
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })

type ResetData = z.infer<typeof resetSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  })

  async function onSubmit(data: ResetData) {
    if (!token) {
      toast.error("Token de redefinição inválido")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Erro ao redefinir senha")
      }
      setSuccess(true)
      toast.success("Senha redefinida com sucesso!")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao redefinir senha",
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Link inválido</h1>
        <p className="text-sm text-zinc-500">
          Este link de redefinição de senha é inválido ou expirou.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Senha redefinida!</h1>
          <p className="text-sm text-zinc-500">
            Sua senha foi alterada com sucesso.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Fazer login
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Redefinir senha</h1>
        <p className="text-sm text-zinc-500">Digite sua nova senha.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                "w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500",
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-700",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar nova senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(
                "w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500",
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-700",
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              aria-label={showConfirm ? "Esconder senha" : "Mostrar senha"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
