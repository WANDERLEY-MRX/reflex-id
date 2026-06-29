"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, Building2 } from "lucide-react"
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

const requestSchema = z.object({
  organizationId: z.string().min(1, "Selecione uma organização"),
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres").max(500, "Máximo de 500 caracteres"),
})

type RequestFormData = z.infer<typeof requestSchema>

interface OrganizationOption {
  id: string
  name: string
}

interface VerificationRequestFormProps {
  organizations: OrganizationOption[]
  onSubmit: (data: RequestFormData) => Promise<void>
  className?: string
}

function VerificationRequestForm({ organizations, onSubmit, className }: VerificationRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  const handleFormSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="organization">Organização Verificadora</Label>
        <Select onValueChange={(value) => setValue("organizationId", value)}>
          <SelectTrigger id="organization" className="w-full">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Selecione uma organização" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.organizationId && (
          <p className="text-xs text-red-500">{errors.organizationId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          placeholder="Descreva o que precisa ser verificado..."
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        <Send className="h-4 w-4" />
        Enviar Solicitação
      </Button>
    </form>
  )
}

export { VerificationRequestForm }
