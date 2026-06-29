"use client"

import * as React from "react"
import { Calendar, Filter, ListFilter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select-radix"

interface TimelineFilterOption {
  value: string
  label: string
}

interface TimelineFilterProps {
  categories?: TimelineFilterOption[]
  types?: TimelineFilterOption[]
  selectedCategory?: string
  selectedType?: string
  onCategoryChange?: (value: string) => void
  onTypeChange?: (value: string) => void
  dateRange?: { from: string; to: string }
  onDateRangeChange?: (range: { from: string; to: string }) => void
  className?: string
}

function TimelineFilter({
  categories,
  types,
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  className,
}: TimelineFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        <span>Filtrar</span>
      </div>

      {categories && categories.length > 0 && (
        <Select value={selectedCategory || "all"} onValueChange={onCategoryChange || (() => {})}>
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs gap-1">
            <ListFilter className="h-3 w-3" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {types && types.length > 0 && (
        <Select value={selectedType || "all"} onValueChange={onTypeChange || (() => {})}>
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs gap-1">
            <ListFilter className="h-3 w-3" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onDateRangeChange && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => {
              const from = prompt("Data início (AAAA-MM-DD)")
              const to = prompt("Data fim (AAAA-MM-DD)")
              if (from && to) {
                onDateRangeChange({ from, to })
              }
            }}
          >
            <Calendar className="h-3 w-3" />
            {dateRange ? `${dateRange.from} ~ ${dateRange.to}` : "Período"}
          </Button>
          {dateRange && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onDateRangeChange({ from: "", to: "" })}
            >
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { TimelineFilter }
