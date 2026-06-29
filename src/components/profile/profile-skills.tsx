"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Skill {
  name: string
  level: number
}

interface SkillCategory {
  name: string
  skills: Skill[]
}

interface ProfileSkillsProps {
  categories: SkillCategory[]
  className?: string
}

function ProfileSkills({ categories, className }: ProfileSkillsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {categories.map((category, catIdx) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: catIdx * 0.1 }}
        >
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {category.name}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <div key={skill.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary transition-all"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export { ProfileSkills }
