"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select-radix"
import { Slider } from "@/components/ui/slider"

const skillSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  category: z.string().min(1, "Selecione uma categoria"),
  level: z.number().min(0).max(100),
})

type SkillFormData = z.infer<typeof skillSchema>

const categories = [
  { value: "hard", label: "Hard Skill" },
  { value: "soft", label: "Soft Skill" },
  { value: "language", label: "Idioma" },
  { value: "tool", label: "Ferramenta" },
]

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => Promise<void>
  initialData?: Partial<SkillFormData>
  className?: string
}

function SkillForm({ onSubmit, initialData, className }: SkillFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [level, setLevel] = React.useState(initialData?.level ?? 50)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">Competência</Label>
        <Input id="name" placeholder="Ex: React, Liderança, Inglês..." {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          defaultValue={initialData?.category}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Nível</Label>
          <span className="text-sm font-medium">{level}%</span>
        </div>
        <Slider
          value={[level]}
          onValueChange={([v]) => {
            setLevel(v)
            setValue("level", v)
          }}
          max={100}
          step={5}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Iniciante</span>
          <span>Intermediário</span>
          <span>Avançado</span>
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {initialData ? "Atualizar Competência" : "Adicionar Competência"}
      </Button>
    </form>
  )
}

export { SkillForm }
