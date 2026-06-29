import type { ReactNode } from "react"
import { OrgSidebar } from "@/components/layout/org-sidebar"
import { Topbar } from "@/components/layout/topbar"

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <OrgSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
