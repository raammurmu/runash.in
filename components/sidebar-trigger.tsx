"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/store/use-sidebar"

export function SidebarTrigger() {
  const { toggle } = useSidebar()

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="h-8 w-8 p-0">
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}
