"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Share2, QrCode, FileDown, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  photo?: string
  name: string
  slug: string
  headline?: string
  onShare?: () => void
  onQRCode?: () => void
  onPDF?: () => void
  className?: string
}

function ProfileHeader({ photo, name, slug, headline, onShare, onQRCode, onPDF, className }: ProfileHeaderProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col items-center text-center", className)}
    >
      <Avatar src={photo} fallback={name} size="xl" className="h-20 w-20 text-xl" />

      <div className="mt-4">
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-sm text-muted-foreground">@{slug}</p>
      </div>

      {headline && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{headline}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado!" : "Copiar link"}
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="h-3.5 w-3.5" />
          Compartilhar
        </Button>
        {onQRCode && (
          <Button variant="outline" size="sm" onClick={onQRCode}>
            <QrCode className="h-3.5 w-3.5" />
            QR Code
          </Button>
        )}
        {onPDF && (
          <Button variant="outline" size="sm" onClick={onPDF}>
            <FileDown className="h-3.5 w-3.5" />
            PDF
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export { ProfileHeader }
