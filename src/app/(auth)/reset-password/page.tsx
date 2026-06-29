"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-sm text-zinc-500">Link de redefinição inválido ou expirado.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
          Solicitar novo link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle2 size={48} className="mx-auto text-green-500" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Senha redefinida!</h1>
          <p className="text-sm text-zinc-500">Sua senha foi alterada com sucesso.</p>
        </div>
        <button onClick={() => router.push("/login")} className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
          Ir para o login
        </button>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Senhas não conferem")
      return
    }
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setDone(true)
      toast.success("Senha redefinida com sucesso!")
    } catch {
      toast.error("Erro ao redefinir senha")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Redefinir senha</h1>
        <p className="text-sm text-zinc-500">Digite sua nova senha</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Nova senha</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar senha</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
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
    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
