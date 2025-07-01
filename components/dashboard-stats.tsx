"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Eye, DollarSign, Video, Clock, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

export function StatCard({ title, value, description, trend, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center pt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn("text-xs ml-1", trend.isPositive ? "text-green-500" : "text-red-500")}>
              {trend.isPositive ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const stats = [
    {
      title: "Total Streams",
      value: "2,847",
      description: "All time streams created",
      trend: { value: 12.5, label: "from last month", isPositive: true },
      icon: Video,
    },
    {
      title: "Live Viewers",
      value: "12,483",
      description: "Currently watching",
      trend: { value: 8.2, label: "from yesterday", isPositive: true },
      icon: Eye,
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      description: "This month's earnings",
      trend: { value: 15.3, label: "from last month", isPositive: true },
      icon: DollarSign,
    },
    {
      title: "Followers",
      value: "89,247",
      description: "Total followers across all channels",
      trend: { value: 5.7, label: "from last week", isPositive: true },
      icon: Users,
    },
    {
      title: "Watch Time",
      value: "1,247h",
      description: "Total hours watched this month",
      trend: { value: 22.1, label: "from last month", isPositive: true },
      icon: Clock,
    },
    {
      title: "Engagement Rate",
      value: "94.2%",
      description: "Average engagement across streams",
      trend: { value: 3.1, label: "from last month", isPositive: true },
      icon: Heart,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
