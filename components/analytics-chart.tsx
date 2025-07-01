"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChartData {
  label: string
  value: number
  change?: number
}

export function AnalyticsChart() {
  const viewerData: ChartData[] = [
    { label: "Mon", value: 1200, change: 5.2 },
    { label: "Tue", value: 1450, change: 8.1 },
    { label: "Wed", value: 1320, change: -2.3 },
    { label: "Thu", value: 1680, change: 12.4 },
    { label: "Fri", value: 2100, change: 18.7 },
    { label: "Sat", value: 2450, change: 22.1 },
    { label: "Sun", value: 1890, change: 8.9 },
  ]

  const revenueData: ChartData[] = [
    { label: "Week 1", value: 2400 },
    { label: "Week 2", value: 3200 },
    { label: "Week 3", value: 2800 },
    { label: "Week 4", value: 4100 },
  ]

  const maxViewers = Math.max(...viewerData.map((d) => d.value))
  const maxRevenue = Math.max(...revenueData.map((d) => d.value))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Viewer Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Viewer Analytics</CardTitle>
            <CardDescription>Daily viewer count for the past week</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {viewerData.map((data, index) => (
              <div key={data.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{data.label}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(data.value / maxViewers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{data.value.toLocaleString()}</span>
                  {data.change && (
                    <span
                      className={cn("text-xs flex items-center", data.change > 0 ? "text-green-600" : "text-red-600")}
                    >
                      {data.change > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(data.change)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Daily Viewers</span>
              <span className="font-medium">1,727</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Peak Viewers</span>
              <span className="font-medium">2,450</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Revenue Analytics</CardTitle>
            <CardDescription>Weekly revenue for the past month</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18.2%
            </Badge>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={data.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-16">{data.label}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(data.value / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium">${data.value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-medium">${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Average Weekly</span>
              <span className="font-medium">
                ${Math.round(revenueData.reduce((sum, d) => sum + d.value, 0) / revenueData.length).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
