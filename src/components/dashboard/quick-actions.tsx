"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, FileText, FolderGit2, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickAction {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  onClick: () => void
}

interface QuickActionsProps {
  onAddEvidence?: () => void
  onAddProject?: () => void
  onInvite?: () => void
  className?: string
}

function QuickActions({ onAddEvidence, onAddProject, onInvite, className }: QuickActionsProps) {
  const actions: QuickAction[] = [
    { id: "evidence", label: "Nova Evidência", description: "Adicionar certificado, diploma ou comprovante", icon: <FileText className="h-5 w-5" />, onClick: onAddEvidence || (() => {}) },
    { id: "project", label: "Novo Projeto", description: "Registrar um projeto profissional ou acadêmico", icon: <FolderGit2 className="h-5 w-5" />, onClick: onAddProject || (() => {}) },
    { id: "invite", label: "Convidar", description: "Convidar colegas para verificar seu perfil", icon: <UserPlus className="h-5 w-5" />, onClick: onInvite || (() => {}) },
  ]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 px-3 py-3"
              onClick={action.onClick}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {action.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{action.label}</p>
                {action.description && (
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                )}
              </div>
              <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

export { QuickActions }
