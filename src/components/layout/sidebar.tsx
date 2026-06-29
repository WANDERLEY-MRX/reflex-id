"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  Timeline,
  FolderKanban,
  FileText,
  Trophy,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/dashboard-store"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Perfil", href: "/profile", icon: User },
  { label: "Timeline", href: "/profile/timeline", icon: Timeline },
  { label: "Projetos", href: "/profile/projects", icon: FolderKanban },
  { label: "Evidências", href: "/evidences", icon: FileText },
  { label: "Conquistas", href: "/achievements", icon: Trophy },
  { label: "Verificações", href: "/verifications", icon: ShieldCheck },
  { label: "Configurações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useDashboardStore()

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        sidebarOpen ? "w-60" : "w-16",
      )}
    >
      <div className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
        {sidebarOpen && (
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Reflex<span className="text-violet-600">ID</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              )}
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block">{sidebarContent}</aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-60">
            <div className="relative h-full">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute -right-10 top-3 rounded-md bg-white p-1.5 shadow-md dark:bg-zinc-800"
                aria-label="Fechar sidebar"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
