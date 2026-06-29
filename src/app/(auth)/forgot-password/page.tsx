"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const forgotSchema = z.object({
  email: z.string().email("Email inválido"),
})

type ForgotData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotData) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Erro ao solicitar redefinição")
      }
      setSent(true)
      toast.success("Email de redefinição enviado!")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao solicitar redefinição de senha",
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Email enviado!</h1>
          <p className="text-sm text-zinc-500">
            Verifique sua caixa de entrada e siga as instruções para redefinir
            sua senha.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          <ArrowLeft size={16} /> Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Esqueceu a senha?</h1>
        <p className="text-sm text-zinc-500">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            {...register("email")}
            className={cn(
              "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500",
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700",
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          <ArrowLeft size={16} /> Voltar para o login
        </Link>
      </p>
    </div>
  )
}
