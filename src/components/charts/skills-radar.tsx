"use client"

import * as React from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SkillData {
  skill: string
  level: number
}

interface SkillsRadarProps {
  data: SkillData[]
  title?: string
  className?: string
}

function SkillsRadar({ data, title = "Competências", className }: SkillsRadarProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <Radar
                name="Nível"
                dataKey="level"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { SkillsRadar }
