"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  Moon,
  Sun,
  Monitor,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/dashboard-store"
import { useLocalAuth } from "@/providers/local-auth-provider"

export function Topbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useDashboardStore()
  const { session, signOut } = useLocalAuth()
  const user = session?.user

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount =
    0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <button
        onClick={toggleSidebar}
        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
        >
          <Search size={16} />
          <span>Buscar...</span>
          <kbd className="ml-auto hidden rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-mono dark:border-zinc-600 dark:bg-zinc-800 md:inline">
            ⌘K
          </kbd>
        </button>

        {searchOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-2 border-b border-zinc-200 px-3 dark:border-zinc-700">
              <Search size={16} className="text-zinc-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar páginas, projetos..."
                className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-zinc-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                ESC
              </button>
            </div>
            <div className="p-2 text-center text-sm text-zinc-400">
              {searchQuery
                ? "Nenhum resultado encontrado"
                : "Digite para buscar..."}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <div className="flex items-center rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              theme === "light"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
            aria-label="Modo claro"
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              theme === "dark"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
            aria-label="Modo escuro"
          >
            <Moon size={16} />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              theme === "system"
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
            aria-label="Sistema"
          >
            <Monitor size={16} />
          </button>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label="Notificações"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar + Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Menu do usuário"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {user?.name ?? "Usuário"}
                </p>
                <p className="text-xs text-zinc-500">{user?.email ?? ""}</p>
              </div>
              <button
                onClick={() => { router.push("/profile"); setProfileOpen(false) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <User size={16} /> Perfil
              </button>
              <button
                onClick={() => { router.push("/settings"); setProfileOpen(false) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Settings size={16} /> Configurações
              </button>
              <hr className="my-1 border-zinc-200 dark:border-zinc-700" />
              <button
                onClick={() => { signOut(); router.push("/"); setProfileOpen(false) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
