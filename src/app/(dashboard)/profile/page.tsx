"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useLocalAuth } from "@/providers/local-auth-provider"
import {
  getProfileByUserId,
  updateProfile,
  type LocalProfile,
} from "@/lib/local-db"

const profileSchema = z.object({
  slug: z.string().min(1, "Slug é obrigatório"),
  bio: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const router = useRouter()
  const { session, loading: authLoading } = useLocalAuth()
  const [profile, setProfile] = useState<LocalProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (authLoading) return
    if (!session) {
      router.push("/login")
      return
    }
    const p = getProfileByUserId(session.user.id)
    setProfile(p)
    if (p) {
      reset({
        slug: p.slug,
        bio: p.bio ?? "",
        headline: p.headline ?? "",
        location: p.location ?? "",
        website: p.website ?? "",
        github: p.github ?? "",
        linkedin: p.linkedin ?? "",
        twitter: p.twitter ?? "",
        instagram: p.instagram ?? "",
      })
    }
  }, [session, authLoading, router, reset])

  async function onSubmit(data: ProfileData) {
    if (!session) return
    setIsLoading(true)
    try {
      updateProfile(session.user.id, {
        slug: data.slug,
        bio: data.bio || null,
        headline: data.headline || null,
        location: data.location || null,
        website: data.website || null,
        github: data.github || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        instagram: data.instagram || null,
      })
      toast.success("Perfil atualizado!")
      router.push("/dashboard")
    } catch {
      toast.error("Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !session) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold">Editar Perfil</h1>
        <p className="text-sm text-zinc-500">Atualize suas informações públicas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="slug" className="text-sm font-medium">Slug (URL pública)</label>
          <input
            id="slug"
            {...register("slug")}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
          {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="headline" className="text-sm font-medium">Headline</label>
          <input
            id="headline"
            {...register("headline")}
            placeholder="Ex: Desenvolvedor Full Stack"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="bio" className="text-sm font-medium">Bio</label>
          <textarea
            id="bio"
            {...register("bio")}
            rows={3}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium">Localização</label>
          <input
            id="location"
            {...register("location")}
            placeholder="São Paulo, SP"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="website" className="text-sm font-medium">Website</label>
            <input id="website" {...register("website")} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700" />
          </div>
          <div className="space-y-1">
            <label htmlFor="github" className="text-sm font-medium">GitHub</label>
            <input id="github" {...register("github")} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700" />
          </div>
          <div className="space-y-1">
            <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</label>
            <input id="linkedin" {...register("linkedin")} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700" />
          </div>
          <div className="space-y-1">
            <label htmlFor="twitter" className="text-sm font-medium">Twitter</label>
            <input id="twitter" {...register("twitter")} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  )
}
