"use client"

import * as React from "react"
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface DataColumn<T> {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataColumn<T>[]
  keyExtractor: (item: T) => string | number
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?: number
  className?: string
  emptyMessage?: string
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchKeys,
  pageSize = 10,
  className,
  emptyMessage = "No results found",
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [sortColumn, setSortColumn] = React.useState<string | undefined>()
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    if (!search.trim()) return data
    const keys = (searchKeys || columns.map(c => c.key as keyof T)) as (keyof T)[]
    return data.filter((item) =>
      keys.some((key) => {
        const val = item[key]
        return val != null ? String(val).toLowerCase().includes(search.toLowerCase()) : false
      })
    )
  }, [data, search, searchKeys, columns])

  const sorted = React.useMemo(() => {
    if (!sortColumn) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      if (aVal == null || bVal == null) return 0
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDirection === "asc" ? cmp : -cmp
    })
  }, [filtered, sortColumn, sortDirection])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(key)
      setSortDirection("asc")
    }
    setPage(1)
  }

  React.useEffect(() => { setPage(1) }, [search])

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "h-10 px-4 text-left align-middle font-medium text-muted-foreground",
                    col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex">
                        {sortColumn === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("p-4 align-middle", col.className)}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({sorted.length} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-xs text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={p === page ? "primary" : "outline"}
                    size="sm"
                    className="min-w-[2rem]"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                </React.Fragment>
              ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { DataTable }
