"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setSent(true)
      toast.success("Email de recuperação enviado!")
    } catch {
      toast.error("Erro ao enviar email")
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle2 size={48} className="mx-auto text-green-500" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Email enviado</h1>
          <p className="text-sm text-zinc-500">
            Verifique sua caixa de entrada em <strong>{email}</strong>
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Esqueceu a senha?</h1>
        <p className="text-sm text-zinc-500">
          Informe seu email para receber um link de recuperação
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700",
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Lembrou a senha?{" "}
        <Link
          href="/login"
          className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
