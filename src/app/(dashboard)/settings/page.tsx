"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useLocalAuth } from "@/providers/local-auth-provider"
import { updateUser } from "@/lib/local-db"

export default function SettingsPage() {
  const router = useRouter()
  const { session, loading: authLoading, refreshSession } = useLocalAuth()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user) setName(session.user.name)
  }, [session])

  async function handleSave() {
    if (!session) return
    setIsLoading(true)
    try {
      updateUser(session.user.id, { name })
      refreshSession()
      toast.success("Configurações salvas!")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin" /></div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-zinc-500">Gerencie sua conta e preferências</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Perfil</h2>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            value={session.user.email}
            disabled
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Aparência</h2>
        <div className="flex gap-2">
          {[
            { value: "light", icon: Sun, label: "Claro" },
            { value: "dark", icon: Moon, label: "Escuro" },
            { value: "system", icon: Monitor, label: "Sistema" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors",
                theme === value
                  ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                  : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800",
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Conta</h2>
        <p className="text-sm text-zinc-500">
          Email: {session.user.email} | Função: {session.user.role}
        </p>
      </section>
    </div>
  )
}
