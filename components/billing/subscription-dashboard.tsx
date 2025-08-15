"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SubscriptionManager,
  type Subscription,
  type SubscriptionPlan,
  type UsageRecord,
} from "@/lib/subscription-manager"
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  X,
  Download,
  Settings,
  Clock,
  Zap,
} from "lucide-react"

interface SubscriptionDashboardProps {
  userId: string
}

export function SubscriptionDashboard({ userId }: SubscriptionDashboardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [usage, setUsage] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const subscriptionManager = SubscriptionManager.getInstance()

  useEffect(() => {
    loadSubscriptionData()
  }, [userId])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)

      // Load subscription, plan, and usage data
      const [subscriptions, plans] = await Promise.all([
        fetch(`/api/billing/subscriptions?userId=${userId}`).then((r) => r.json()),
        subscriptionManager.getPlans(),
      ])

      const activeSubscription = subscriptions.subscriptions?.[0]
      if (activeSubscription) {
        setSubscription(activeSubscription)
        const currentPlan = plans.find((p) => p.id === activeSubscription.planId)
        setPlan(currentPlan || null)

        // Load usage data
        const usageData = await subscriptionManager.getUsage(activeSubscription.id, {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        })
        setUsage(usageData)
      }
    } catch (error) {
      console.error("Failed to load subscription data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseSubscription = async () => {
    if (!subscription) return

    try {
      setActionLoading("pause")
      await subscriptionManager.pauseSubscription(subscription.id)
      await loadSubscriptionData()
    } catch (error) {
      console.error("Failed to pause subscription:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeSubscription = async () => {
    if (!subscription) return

    try {
      setActionLoading("resume")
      await subscriptionManager.resumeSubscription(subscription.id)
      await loadSubscriptionData()
    } catch (error) {
      console.error("Failed to resume subscription:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    try {
      setActionLoading("cancel")
      await subscriptionManager.cancelSubscription(subscription.id)
      await loadSubscriptionData()
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "trialing":
        return "bg-blue-500"
      case "past_due":
        return "bg-yellow-500"
      case "canceled":
        return "bg-red-500"
      case "paused":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "trialing":
        return <Clock className="h-4 w-4" />
      case "past_due":
        return <AlertTriangle className="h-4 w-4" />
      case "canceled":
        return <X className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const calculateUsageMetrics = () => {
    if (!plan || !usage.length) return {}

    const metrics = {
      streamingHours: usage.filter((u) => u.metric === "streaming_hours").reduce((sum, u) => sum + u.quantity, 0),
      apiCalls: usage.filter((u) => u.metric === "api_calls").reduce((sum, u) => sum + u.quantity, 0),
      storage: usage.filter((u) => u.metric === "storage").reduce((sum, u) => sum + u.quantity, 0),
      bandwidth: usage.filter((u) => u.metric === "bandwidth").reduce((sum, u) => sum + u.quantity, 0),
    }

    return {
      streamingHours: {
        used: metrics.streamingHours,
        limit: plan.limits.streamingHours,
        percentage: subscriptionManager.calculateUsagePercentage(metrics.streamingHours, plan.limits.streamingHours),
      },
      apiCalls: {
        used: metrics.apiCalls,
        limit: plan.limits.apiCalls,
        percentage: subscriptionManager.calculateUsagePercentage(metrics.apiCalls, plan.limits.apiCalls),
      },
      storage: {
        used: metrics.storage,
        limit: plan.limits.storage,
        percentage: subscriptionManager.calculateUsagePercentage(metrics.storage, plan.limits.storage),
      },
      bandwidth: {
        used: metrics.bandwidth,
        limit: plan.limits.bandwidth,
        percentage: subscriptionManager.calculateUsagePercentage(metrics.bandwidth, plan.limits.bandwidth),
      },
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!subscription || !plan) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
            <p className="text-gray-600 mb-4">You don't have an active subscription yet.</p>
            <Button>Choose a Plan</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const usageMetrics = calculateUsageMetrics()
  const daysUntilBilling = subscriptionManager.getDaysUntilBilling(subscription)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Dashboard</h1>
          <p className="text-gray-600">Manage your subscription and monitor usage</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{plan.name} Plan</span>
                <Badge className={getStatusColor(subscription.status)}>
                  {getStatusIcon(subscription.status)}
                  <span className="ml-1 capitalize">{subscription.status}</span>
                </Badge>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${plan.price}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Next Billing</div>
                <div className="text-sm text-gray-600">
                  {daysUntilBilling} days ({new Date(subscription.currentPeriodEnd).toLocaleDateString()})
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Payment Method</div>
                <div className="text-sm text-gray-600">•••• •••• •••• 4242</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Status</div>
                <div className="text-sm text-gray-600 capitalize">{subscription.status}</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            {subscription.status === "paused" ? (
              <Button onClick={handleResumeSubscription} disabled={actionLoading === "resume"}>
                <Play className="h-4 w-4 mr-2" />
                Resume Subscription
              </Button>
            ) : (
              <Button variant="outline" onClick={handlePauseSubscription} disabled={actionLoading === "pause"}>
                <Pause className="h-4 w-4 mr-2" />
                Pause Subscription
              </Button>
            )}
            <Button variant="outline" onClick={handleCancelSubscription} disabled={actionLoading === "cancel"}>
              <X className="h-4 w-4 mr-2" />
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(usageMetrics).map(([key, metric]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used: {metric.used.toLocaleString()}</span>
                      <span>Limit: {metric.limit === -1 ? "Unlimited" : metric.limit.toLocaleString()}</span>
                    </div>
                    <Progress value={metric.percentage} className="h-2" />
                    <div className="text-xs text-gray-600">{metric.percentage.toFixed(1)}% of limit used</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your payment methods and billing details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/2025</div>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Invoice #{`INV-${2024}${String(i).padStart(3, "0")}`}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${plan.price}</div>
                        <Badge variant="secondary">Paid</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
