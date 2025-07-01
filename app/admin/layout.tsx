import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminGuard } from "@/components/admin-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AdminGuard>
  )
}
