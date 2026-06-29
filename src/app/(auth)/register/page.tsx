"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { message: "Você precisa aceitar os termos" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterData) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Erro ao criar conta")
      }
      toast.success("Conta criada com sucesso!")
      router.push("/dashboard")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar conta",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-zinc-500">
          Junte-se ao Reflex ID
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            {...register("name")}
            className={cn(
              "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500",
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-700",
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

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

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
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
            Confirmar senha
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

        <div className="flex items-start gap-2">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register("acceptTerms")}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="acceptTerms" className="text-xs text-zinc-500">
            Aceito os{" "}
            <Link href="/terms" className="text-violet-600 hover:text-violet-700 dark:text-violet-400">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700 dark:text-violet-400">
              Política de Privacidade
            </Link>{" "}
            em conformidade com a LGPD.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isLoading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900">
            Ou continuar com
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Google", provider: "google" },
          { name: "Apple", provider: "apple" },
          { name: "GitHub", provider: "github" },
          { name: "Microsoft", provider: "microsoft" },
        ].map(({ name, provider }) => (
          <button
            key={provider}
            type="button"
            onClick={() => {/* signIn(provider) */}}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {name}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-zinc-500">
        Já tem uma conta?{" "}
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
