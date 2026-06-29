"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  Loader2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useLocalAuth } from "@/providers/local-auth-provider"
import {
  getTimelineByUserId,
  addTimelineEvent as addTimelineEventDb,
  type LocalTimelineEvent,
} from "@/lib/local-db"

const timelineSchema = z.object({
  title: z.string().min(2, "Título deve ter no mínimo 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  date: z.string().min(1, "Data é obrigatória"),
  category: z.enum(["work", "education", "achievement", "personal"]),
})

type TimelineData = z.infer<typeof timelineSchema>

const categoryLabels: Record<string, string> = {
  work: "Trabalho",
  education: "Educação",
  achievement: "Conquista",
  personal: "Pessoal",
}

const categoryIcons: Record<string, typeof Briefcase> = {
  work: Briefcase,
  education: GraduationCap,
  achievement: Award,
  personal: Heart,
}

export default function TimelinePage() {
  const router = useRouter()
  const { session, loading: authLoading } = useLocalAuth()
  const [events, setEvents] = useState<LocalTimelineEvent[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimelineData>({
    resolver: zodResolver(timelineSchema),
  })

  useEffect(() => {
    if (!authLoading && !session) router.push("/login")
  }, [session, authLoading, router])

  useEffect(() => {
    if (session) setEvents(getTimelineByUserId(session.user.id))
  }, [session])

  function reload() {
    if (session) setEvents(getTimelineByUserId(session.user.id))
  }

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((e) => e.category === filter)

  function openAdd() {
    reset({ title: "", description: "", date: "", category: "work" })
    setIsAdding(true)
    setEditingId(null)
  }

  function openEdit(event: LocalTimelineEvent) {
    reset({
      title: event.title,
      description: event.description ?? "",
      date: event.date,
      category: event.category as TimelineData["category"],
    })
    setEditingId(event.id)
    setIsAdding(true)
  }

  async function onSubmit(data: TimelineData) {
    if (!session) return
    setIsLoading(true)
    try {
      addTimelineEventDb(session.user.id, {
        title: data.title,
        description: data.description,
        date: data.date,
        category: data.category,
        verifiedById: null,
      })
      setIsAdding(false)
      setEditingId(null)
      reload()
      toast.success("Evento adicionado!")
    } catch {
      toast.error("Erro ao salvar evento")
    } finally {
      setIsLoading(false)
    }
  }

  function deleteEvent(id: string) {
    const events2 = events.filter((e) => e.id !== id)
    localStorage.setItem("reflexid_timeline", JSON.stringify(events2))
    reload()
    toast.success("Evento removido")
  }

  if (authLoading || !session) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Timeline</h1>
          <p className="text-sm text-zinc-500">
            Sua linha do tempo profissional
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={16} /> Adicionar Evento
        </button>
      </div>

      <div className="flex gap-2">
        {["all", "work", "education", "achievement", "personal"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === cat
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
              )}
            >
              {cat === "all" ? "Todos" : categoryLabels[cat]}
            </button>
          ),
        )}
      </div>

      {isAdding && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {editingId ? "Editar Evento" : "Novo Evento"}
            </h2>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null) }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <input
                id="title"
                placeholder="Título do evento"
                {...register("title")}
                className={cn(
                  "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                  errors.title
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700",
                )}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <textarea
                id="description"
                rows={2}
                placeholder="Descreva o evento..."
                {...register("description")}
                className={cn(
                  "w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                  errors.description
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700",
                )}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="date" className="text-sm font-medium">
                  Data
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date")}
                  className={cn(
                    "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                    errors.date
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-700",
                  )}
                />
                {errors.date && (
                  <p className="text-xs text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="text-sm font-medium">
                  Categoria
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null) }}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative space-y-0">
        {filteredEvents.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Clock size={40} className="mx-auto text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">
              Nenhum evento encontrado
            </p>
          </div>
        )}
        {filteredEvents.map((event, index) => {
          const Icon = categoryIcons[event.category] || Clock
          return (
            <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                  <Icon size={16} className="text-zinc-500" />
                </div>
                {index < filteredEvents.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                )}
              </div>
              <div className="flex-1 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {categoryLabels[event.category]} · {event.date}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(event)}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {event.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
