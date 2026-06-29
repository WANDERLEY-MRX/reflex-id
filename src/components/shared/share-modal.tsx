"use client"

import * as React from "react"
import { Copy, Check, QrCode, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url?: string
  title?: string
  className?: string
}

function ShareModal({ open, onOpenChange, url, title = "Compartilhar Perfil", className }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false)

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const embedCode = `<iframe src="${shareUrl}/embed" width="600" height="400" frameborder="0"></iframe>`

  const tabs = [
    {
      value: "link",
      label: "Link",
      content: (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="text-xs" />
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <p className="text-xs text-zinc-500">Compartilhe este link para que outras pessoas vejam seu perfil.</p>
        </div>
      ),
    },
    {
      value: "embed",
      label: "Embed",
      content: (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={embedCode} readOnly className="text-xs font-mono" />
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0">
              <Copy className="h-3.5 w-3.5" />
              Copiar
            </Button>
          </div>
          <p className="text-xs text-zinc-500">Copie o código HTML para incorporar seu perfil em outros sites.</p>
        </div>
      ),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Compartilhe seu perfil com outras pessoas ou incorpore em sites.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Link
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="h-3.5 w-3.5 mr-1.5" />
              Embed
            </TabsTrigger>
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="pt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export { ShareModal }
