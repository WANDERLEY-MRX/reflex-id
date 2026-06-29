"use client"

import * as React from "react"
import { Search, Command as CommandIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "./dialog"

interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  label?: string
  placeholder?: string
  className?: string
}

function CommandDialog({ open, onOpenChange, children, label = "Command menu", placeholder = "Type a command...", className }: CommandProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const childrenArray = React.Children.toArray(children)
  const filteredChildren = childrenArray.filter((child) => {
    if (React.isValidElement(child)) {
      const props = child.props as Record<string, unknown>
      if (props["data-value"]) {
        return String(props["data-value"]).toLowerCase().includes(query.toLowerCase())
      }
    }
    return true
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredChildren.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        const selected = filteredChildren[selectedIndex]
        if (React.isValidElement(selected)) {
          const props = selected.props as Record<string, unknown>
          if (typeof props.onSelect === "function") {
            ;(props.onSelect as () => void)()
          }
        }
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden p-0" onKeyDown={handleKeyDown}>
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            autoFocus
            aria-label={label}
          />
          <kbd className="hidden rounded-md border border-border bg-secondary px-1.5 text-[10px] text-muted-foreground sm:inline-flex items-center gap-0.5">
            <CommandIcon className="h-3 w-3" />K
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-1 scrollbar-thin">
          {filteredChildren.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredChildren.map((child, index) => {
              if (!React.isValidElement(child)) return child
              const props = child.props as Record<string, unknown>
              return React.cloneElement(child as React.ReactElement<any>, {
                className: cn(
                  props.className as string,
                  "flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer transition-colors",
                  index === selectedIndex && "bg-accent text-accent-foreground"
                ),
                onClick: () => {
                  if (typeof props.onClick === "function") (props.onClick as () => void)()
                  if (typeof props.onSelect === "function") (props.onSelect as () => void)()
                  onOpenChange?.(false)
                },
              })
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CommandGroupProps {
  heading?: string
  children?: React.ReactNode
  className?: string
}

function CommandGroup({ heading, children, className }: CommandGroupProps) {
  return (
    <div className={cn("", className)}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
}

interface CommandItemProps {
  value?: string
  onSelect?: () => void
  icon?: React.ReactNode
  shortcut?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  "data-value"?: string
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ value, onSelect, icon, shortcut, children, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
          className
        )}
        onClick={() => {
          onClick?.()
          onSelect?.()
        }}
        role="option"
        tabIndex={0}
        data-value={value}
        {...props}
      >
        {icon && <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">{icon}</span>}
        <span className="flex-1">{children}</span>
        {shortcut && (
          <kbd className="ml-auto rounded-md border border-border bg-secondary px-1.5 text-[10px] text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </div>
    )
  }
)
CommandItem.displayName = "CommandItem"

function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}

export { CommandDialog, CommandGroup, CommandItem, useCommandPalette }
