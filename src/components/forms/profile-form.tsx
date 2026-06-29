"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"

const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres").max(50).regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000, "Máximo de 2000 caracteres").optional(),
  location: z.string().max(100).optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData & { photo?: string }>
  onSubmit: (data: ProfileFormData & { photo?: File }) => Promise<void>
  className?: string
}

function ProfileForm({ initialData, onSubmit, className }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [photoFile, setPhotoFile] = React.useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(initialData?.photo || null)
  const photoInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({ ...data, photo: photoFile || undefined })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-6", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar src={photoPreview || undefined} fallback={initialData?.name || "?"} size="xl" className="h-16 w-16" />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <input ref={photoInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
        <div>
          <p className="text-sm font-medium">Foto do Perfil</p>
          <p className="text-xs text-muted-foreground">PNG, JPG até 2MB</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline (opcional)</Label>
        <Input id="headline" placeholder="Ex: Engenheiro de Software | Full Stack" {...register("headline")} />
        {errors.headline && <p className="text-xs text-red-500">{errors.headline.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia (opcional)</Label>
        <Textarea id="bio" rows={4} {...register("bio")} />
        {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Localização (opcional)</Label>
          <Input id="location" placeholder="Ex: São Paulo, SP" {...register("location")} />
          {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (opcional)</Label>
          <Input id="website" placeholder="https://..." {...register("website")} />
          {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Empresa (opcional)</Label>
          <Input id="company" {...register("company")} />
          {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Cargo (opcional)</Label>
          <Input id="role" {...register("role")} />
          {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Salvar Perfil
      </Button>
    </form>
  )
}

export { ProfileForm }
