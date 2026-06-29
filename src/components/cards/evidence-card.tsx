"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, Download, ExternalLink, MoreHorizontal, Clock, CheckCircle2, XCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type VerificationStatus = "pending" | "verified" | "rejected" | "expired"

interface EvidenceCardProps {
  id: string
  title: string
  type: string
  date: Date | string
  verificationStatus: VerificationStatus
  confidenceLevel?: number
  hashPreview?: string
  className?: string
}

const statusConfig: Record<VerificationStatus, { label: string; icon: React.ReactNode; variant: "warning" | "success" | "error" | "default" }> = {
  pending: { label: "Pendente", icon: <Clock className="h-3 w-3" />, variant: "warning" },
  verified: { label: "Verificado", icon: <CheckCircle2 className="h-3 w-3" />, variant: "success" },
  rejected: { label: "Rejeitado", icon: <XCircle className="h-3 w-3" />, variant: "error" },
  expired: { label: "Expirado", icon: <Shield className="h-3 w-3" />, variant: "default" },
}

function EvidenceCard({ id, title, type, date, verificationStatus, confidenceLevel, hashPreview, className }: EvidenceCardProps) {
  const status = statusConfig[verificationStatus]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("group", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm leading-snug truncate">{title}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{type}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={status.variant} size="sm" className="gap-1">
                    {status.icon}
                    {status.label}
                  </Badge>

                  {confidenceLevel != null && (
                    <span className="text-xs text-muted-foreground">
                      Confiança: {confidenceLevel}%
                    </span>
                  )}

                  <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
                </div>

                {hashPreview && (
                  <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                    {hashPreview.slice(0, 12)}...
                  </p>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { EvidenceCard }
