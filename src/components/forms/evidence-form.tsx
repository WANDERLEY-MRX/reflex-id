"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload, Link, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select-radix"

const evidenceSchema = z.object({
  type: z.string().min(1, "Selecione o tipo de evidência"),
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(200, "Máximo de 200 caracteres"),
  description: z.string().max(1000, "Máximo de 1000 caracteres").optional(),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
})

type EvidenceFormData = z.infer<typeof evidenceSchema>

const evidenceTypes = [
  { value: "certificate", label: "Certificado" },
  { value: "diploma", label: "Diploma" },
  { value: "license", label: "Licença" },
  { value: "publication", label: "Publicação" },
  { value: "recommendation", label: "Recomendação" },
  { value: "other", label: "Outro" },
]

interface EvidenceFormProps {
  onSubmit: (data: EvidenceFormData & { files: File[] }) => Promise<void>
  className?: string
}

function EvidenceForm({ onSubmit, className }: EvidenceFormProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EvidenceFormData>({
    resolver: zodResolver(evidenceSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selected])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: EvidenceFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({ ...data, files })
      setFiles([])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Evidência</Label>
        <Select onValueChange={(value) => setValue("type", value)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {evidenceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Ex: Certificado de Conclusão - Curso X" {...register("title")} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea id="description" placeholder="Descreva a evidência..." rows={3} {...register("description")} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Arquivos</Label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Upload className="h-5 w-5" />
          <span>Clique para fazer upload ou arraste arquivos</span>
        </div>
        {files.length > 0 && (
          <div className="space-y-1.5">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                <span className="truncate">{file.name}</span>
                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFile(i)}>
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (opcional)</Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="link" placeholder="https://..." className="pl-9" {...register("link")} />
        </div>
        {errors.link && <p className="text-xs text-red-500">{errors.link.message}</p>}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Salvar Evidência
      </Button>
    </form>
  )
}

export { EvidenceForm }
