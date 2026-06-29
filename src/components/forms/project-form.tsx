"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, X, Upload, Link, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const projectSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(200),
  description: z.string().max(2000).optional(),
  repositoryUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  demoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  results: z.string().max(1000).optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData & { technologies: string[]; images: File[] }) => Promise<void>
  className?: string
}

function ProjectForm({ onSubmit, className }: ProjectFormProps) {
  const [technologies, setTechnologies] = React.useState<string[]>([])
  const [techInput, setTechInput] = React.useState("")
  const [images, setImages] = React.useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  const addTechnology = () => {
    const trimmed = techInput.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies((prev) => [...prev, trimmed])
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tech))
  }

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechnology()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...selected])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({ ...data, technologies, images })
      setTechnologies([])
      setImages([])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Projeto</Label>
        <Input id="name" placeholder="Ex: Meu Projeto Incrível" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea id="description" placeholder="Descreva seu projeto..." rows={4} {...register("description")} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Tecnologias</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="Digite e pressione Enter..."
          />
          <Button type="button" variant="outline" size="sm" onClick={addTechnology}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <Badge key={tech} variant="default" size="md" className="gap-1">
                {tech}
                <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Imagens</Label>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Upload className="h-5 w-5" />
          <span>Clique para adicionar imagens</span>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-lg bg-secondary overflow-hidden">
                <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="repositoryUrl">URL do Repositório (opcional)</Label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="repositoryUrl" placeholder="https://github.com/..." className="pl-9" {...register("repositoryUrl")} />
          </div>
          {errors.repositoryUrl && <p className="text-xs text-red-500">{errors.repositoryUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="demoUrl">URL de Demo (opcional)</Label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="demoUrl" placeholder="https://..." className="pl-9" {...register("demoUrl")} />
          </div>
          {errors.demoUrl && <p className="text-xs text-red-500">{errors.demoUrl.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="results">Resultados (opcional)</Label>
        <Textarea id="results" placeholder="Impacto, métricas, conquistas..." rows={3} {...register("results")} />
        {errors.results && <p className="text-xs text-red-500">{errors.results.message}</p>}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Salvar Projeto
      </Button>
    </form>
  )
}

export { ProjectForm }
