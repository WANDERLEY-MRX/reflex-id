"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  User,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })

type PasswordData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    mentions: true,
    verification: true,
    marketing: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  async function onChangePassword(data: PasswordData) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao alterar senha")
      toast.success("Senha alterada com sucesso!")
      reset({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      toast.error("Erro ao alterar senha")
    } finally {
      setIsLoading(false)
    }
  }

  function handleExport() {
    toast.success("Exportação iniciada. Você receberá um email com seus dados.")
  }

  function handleDeleteAccount() {
    if (
      window.confirm(
        "Tem certeza? Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.",
      )
    ) {
      toast.success("Conta excluída com sucesso.")
    }
  }

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "password", label: "Senha", icon: Lock },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "privacy", label: "Privacidade", icon: Shield },
    { id: "data", label: "Exportar Dados", icon: Download },
    { id: "danger", label: "Zona Perigosa", icon: Trash2 },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-zinc-500">
          Gerencie suas preferências da conta
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Sidebar Tabs */}
        <nav className="flex shrink-0 gap-1 overflow-x-auto lg:w-48 lg:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Preferências de Perfil</h2>
              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nome de exibição</label>
                  <input
                    defaultValue="Usuário"
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Tema</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Alterar Senha</h2>
              <form
                onSubmit={handleSubmit(onChangePassword)}
                className="mt-4 space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      {...register("currentPassword")}
                      className={cn(
                        "w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-zinc-300 dark:border-zinc-700",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      {...register("newPassword")}
                      className={cn(
                        "w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                        errors.newPassword
                          ? "border-red-500"
                          : "border-zinc-300 dark:border-zinc-700",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={cn(
                        "w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-zinc-300 dark:border-zinc-700",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
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

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                  >
                    {isLoading && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Alterar senha
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Preferências de Notificação</h2>
              <div className="mt-4 space-y-4">
                {[
                  { id: "email", label: "Notificações por email" },
                  { id: "push", label: "Notificações push" },
                  { id: "mentions", label: "Menções" },
                  { id: "verification", label: "Atualizações de verificação" },
                  { id: "marketing", label: "Marketing e novidades" },
                ].map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{label}</span>
                    <input
                      type="checkbox"
                      checked={
                        notifications[id as keyof typeof notifications]
                      }
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [id]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeTab === "privacy" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Privacidade (LGPD)</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Perfil público
                    </p>
                    <p className="text-xs text-zinc-500">
                      Permitir que seu perfil seja encontrado em buscas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Compartilhar dados de verificação
                    </p>
                    <p className="text-xs text-zinc-500">
                      Permitir que empresas vejam suas credenciais verificadas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                  />
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
                  Em conformidade com a Lei Geral de Proteção de Dados (LGPD -
                  Lei nº 13.709/2018). Você pode solicitar a exclusão dos seus
                  dados a qualquer momento.
                </div>
              </div>
            </div>
          )}

          {/* 2FA */}
          {activeTab === "privacy" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Autenticação de Dois Fatores</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    2FA via aplicativo autenticador
                  </p>
                  <p className="text-xs text-zinc-500">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                  Habilitar
                </button>
              </div>
            </div>
          )}

          {/* Export Data */}
          {activeTab === "data" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold">Exportar Dados</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Baixe todos os seus dados em formato JSON. Inclui perfil,
                projetos, evidências e configurações.
              </p>
              <button
                onClick={handleExport}
                className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                <Download size={16} /> Exportar meus dados
              </button>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <div className="rounded-xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-zinc-900">
              <h2 className="font-semibold text-red-600 dark:text-red-400">
                Zona Perigosa
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Ações irreversíveis. Cuidado!
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900">
                  <div>
                    <p className="text-sm font-medium">
                      Excluir conta
                    </p>
                    <p className="text-xs text-zinc-500">
                      Remove permanentemente sua conta e todos os dados
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Excluir conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
