"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Camera,
  Globe,
  MapPin,
  Link2,
  Hash,
  Save,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const profileSchema = z.object({
  slug: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  headline: z.string().max(100, "Máximo de 100 caracteres").optional(),
  bio: z.string().max(500, "Máximo de 500 caracteres").optional(),
  location: z.string().max(80).optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  interests: z.string().optional(),
  goals: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  })

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(data: ProfileData) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar perfil")
      toast.success("Perfil atualizado com sucesso!")
    } catch {
      toast.error("Erro ao salvar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Editar Perfil</h1>
        <p className="text-sm text-zinc-500">
          Gerencie suas informações públicas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Photo Upload */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Foto</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-zinc-400" />
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-md hover:bg-violet-700"
              >
                <Camera size={14} />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-sm text-zinc-500">
              <p>JPG, PNG ou WebP. Máximo 5MB.</p>
              <p>Recomendado 400x400px.</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Informações Básicas</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug único
              </label>
              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  id="slug"
                  placeholder="seu-slug"
                  {...register("slug")}
                  className={cn(
                    "w-full rounded-lg border bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500",
                    errors.slug
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-700",
                  )}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="headline" className="text-sm font-medium">
                Headline
              </label>
              <input
                id="headline"
                placeholder="Ex: Desenvolvedor Full Stack"
                {...register("headline")}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Conte um pouco sobre você..."
                {...register("bio")}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="location" className="text-sm font-medium">
                Localização
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  id="location"
                  placeholder="Cidade, Estado"
                  {...register("location")}
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Links Sociais</h2>
          <div className="space-y-4">
            {[
              { id: "website", label: "Website", icon: Globe },
              { id: "github", label: "GitHub", icon: Link2 },
              { id: "linkedin", label: "LinkedIn", icon: Link2 },
              { id: "twitter", label: "Twitter", icon: Link2 },
            ].map(({ id, label, icon: Icon }) => (
              <div key={id} className="space-y-1">
                <label htmlFor={id} className="text-sm font-medium">
                  {label}
                </label>
                <div className="relative">
                  <Icon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    id={id}
                    placeholder={`https://${label.toLowerCase()}.com/...`}
                    {...register(id as keyof ProfileData)}
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 pl-9 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests & Goals */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold">Interesses e Objetivos</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="interests" className="text-sm font-medium">
                Interesses
              </label>
              <textarea
                id="interests"
                rows={2}
                placeholder="React, Node.js, UI Design..."
                {...register("interests")}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="goals" className="text-sm font-medium">
                Objetivos
              </label>
              <textarea
                id="goals"
                rows={2}
                placeholder="Me tornar tech lead, contribuir com open source..."
                {...register("goals")}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Preview do Perfil Público</h2>
            <a
              href="#"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              Ver perfil público →
            </a>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-300 text-xl font-bold text-white dark:bg-zinc-600">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                "U"
              )}
            </div>
            <div>
              <p className="font-medium">Seu Nome</p>
              <p className="text-xs text-zinc-500">reflex.id/seu-slug</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  )
}
