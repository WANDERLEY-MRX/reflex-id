"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-secondary p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

function AnimatedTabs({ tabs, defaultTab }: { tabs: { value: string; label: string; content: React.ReactNode }[]; defaultTab?: string }) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.value)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="relative">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} onClick={() => setActiveTab(tab.value)}>
            {tab.label}
          </TabsTrigger>
        ))}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          layoutId="tab-indicator"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex(t => t.value === activeTab) * 100}%)`,
          }}
        />
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, AnimatedTabs }
