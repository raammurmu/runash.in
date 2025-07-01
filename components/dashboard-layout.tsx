"use client"

import { ChevronRight, Home, LayoutDashboard, ListChecks, Search, Settings, User, Users } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSidebar } from "@/store/use-sidebar"
import { Link } from "react-router-dom"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const sidebarWidth = 250

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Your personal dashboard",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your account",
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListChecks,
    description: "Manage your tasks",
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
    description: "AI-powered search",
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    description: "Manage users",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "Your profile settings",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Application settings",
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const { isOpen, onOpen, onClose } = useSidebar()

  return (
    <div className="flex h-screen">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden" onClick={onOpen}>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar isCollapsed={isCollapsed} />
        </SheetContent>
      </Sheet>
      <aside
        className={cn(
          "group/sidebar hidden h-full border-r bg-secondary py-4 transition-all duration-300 ease-in-out md:block",
          isCollapsed ? "w-[70px]" : `w-[${sidebarWidth}px]`,
        )}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

interface SidebarProps {
  isCollapsed: boolean
}

function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <div className="flex h-full flex-col space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Acme Co.</h2>
        <Separator className="bg-muted" />
      </div>
      <div className="flex-1 space-y-1">
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.url}
            title={item.title}
            url={item.url}
            icon={item.icon}
            description={item.description}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  )
}

interface SidebarNavItemProps {
  title: string
  url: string
  icon: any
  description: string
  isCollapsed: boolean
}

function SidebarNavItem({ title, url, icon: Icon, description, isCollapsed }: SidebarNavItemProps) {
  return (
    <Link to={url}>
      <Button variant="ghost" className="w-full justify-start gap-2 p-2">
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{title}</span>}
      </Button>
    </Link>
  )
}
