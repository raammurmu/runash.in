"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  DollarSign,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap,
  Shield,
  Loader2,
} from "lucide-react"
import { useAdminStats, useAdminAlerts } from "@/hooks/use-admin"

export default function AdminDashboard() {
  const { stats, loading: statsLoading, error: statsError } = useAdminStats()
  const { alerts, loading: alertsLoading, resolveAlert } = useAdminAlerts()

  if (statsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error loading admin dashboard</h2>
          <p className="text-muted-foreground">{statsError || "Stats not found"}</p>
        </div>
      </div>
    )
  }

  const unresolvedAlerts = alerts.filter((alert) => !alert.is_resolved)
  const criticalAlerts = unresolvedAlerts.filter((alert) => alert.severity >= 4)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the RunAsh platform</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white">
          <Shield className="mr-1 h-3 w-3" />
          Admin Access
        </Badge>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>{criticalAlerts.length} critical alert(s)</strong> require immediate attention.
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto ml-2 text-red-600 hover:text-red-700"
              onClick={() => {
                // Navigate to alerts section
                document.getElementById("alerts-section")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              View alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.newUsers24h} new in last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">${stats.totalRevenue.toLocaleString()} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.concurrentStreams.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.totalStreams.toLocaleString()} total streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">{stats.activeSessions} active sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Performance
            </CardTitle>
            <CardDescription>Real-time system metrics and health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>{stats.systemHealth.cpu}%</span>
              </div>
              <Progress value={stats.systemHealth.cpu} className={stats.systemHealth.cpu > 80 ? "bg-red-100" : ""} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory Usage</span>
                <span>{stats.systemHealth.memory}%</span>
              </div>
              <Progress
                value={stats.systemHealth.memory}
                className={stats.systemHealth.memory > 85 ? "bg-red-100" : ""}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage Used</span>
                <span>{stats.systemHealth.storage} TB</span>
              </div>
              <Progress value={(stats.systemHealth.storage / 10) * 100} />
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span className={stats.systemHealth.apiResponseTime > 200 ? "text-red-600" : "text-green-600"}>
                  {stats.systemHealth.apiResponseTime}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card id="alerts-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
              {unresolvedAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {unresolvedAlerts.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Recent system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                No alerts - system is healthy
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.is_resolved
                      ? "bg-gray-50"
                      : alert.alert_type === "error"
                        ? "bg-red-50 border-red-200"
                        : alert.alert_type === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div
                    className={`p-1 rounded ${
                      alert.alert_type === "error"
                        ? "bg-red-100"
                        : alert.alert_type === "warning"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {alert.alert_type === "error" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : alert.alert_type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      {alert.is_resolved && (
                        <Badge variant="secondary" className="text-xs">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  {!alert.is_resolved && (
                    <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage users and accounts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-200">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Billing & Revenue</h3>
              <p className="text-sm text-muted-foreground">Monitor payments and subscriptions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Feature Flags</h3>
              <p className="text-sm text-muted-foreground">Control feature rollouts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
              <Eye className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium">Content Moderation</h3>
              <p className="text-sm text-muted-foreground">Review reported content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
