"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, GitFork, Eye, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  name: string
  description?: string
  technologies: string[]
  thumbnail?: string
  stats?: {
    stars?: number
    forks?: number
    views?: number
  }
  links?: {
    label: string
    url: string
  }[]
  className?: string
}

function ProjectCard({ name, description, technologies, thumbnail, stats, links, className }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden group", className)}>
        {thumbnail && (
          <div className="aspect-video w-full overflow-hidden bg-secondary">
            <img
              src={thumbnail}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>
        )}

        <CardContent className="p-4">
          <h4 className="font-semibold text-sm truncate">{name}</h4>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {technologies.map((tech, i) => (
              <Badge key={i} variant="default" size="sm">{tech}</Badge>
            ))}
          </div>

          {stats && (
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              {stats.stars != null && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {stats.stars}
                </span>
              )}
              {stats.forks != null && (
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {stats.forks}
                </span>
              )}
              {stats.views != null && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {stats.views}
                </span>
              )}
            </div>
          )}

          {links && links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map((link, i) => (
                <Button key={i} variant="outline" size="sm" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { ProjectCard }
