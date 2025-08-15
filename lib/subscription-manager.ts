import { BackgroundSync } from "./background-sync"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  yearlyPrice: number
  currency: string
  interval: "monthly" | "yearly"
  features: string[]
  limits: {
    streamingHours: number
    platforms: number
    resolution: string
    storage: number // GB
    bandwidth: number // GB
    apiCalls: number
  }
  isPopular: boolean
  isEnterprise: boolean
  trialDays: number
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing" | "paused"
  currentPeriodStart: string
  currentPeriodEnd: string
  trialStart?: string
  trialEnd?: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  pausedAt?: string
  resumeAt?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface UsageRecord {
  id: string
  subscriptionId: string
  userId: string
  metric: string
  quantity: number
  timestamp: string
  metadata: Record<string, any>
}

export interface Invoice {
  id: string
  subscriptionId: string
  userId: string
  amount: number
  currency: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  dueDate: string
  paidAt?: string
  items: InvoiceItem[]
  tax: number
  discount: number
  total: number
  paymentAttempts: number
  nextPaymentAttempt?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  metadata: Record<string, any>
}

export interface BillingAlert {
  id: string
  userId: string
  type: "usage_limit" | "payment_failed" | "trial_ending" | "subscription_canceled"
  title: string
  message: string
  severity: "info" | "warning" | "error"
  isRead: boolean
  actionRequired: boolean
  actionUrl?: string
  createdAt: string
}

export class SubscriptionManager {
  private static instance: SubscriptionManager
  private backgroundSync: BackgroundSync
  private usageListeners: ((usage: UsageRecord) => void)[] = []
  private billingListeners: ((alert: BillingAlert) => void)[] = []

  private constructor() {
    this.backgroundSync = BackgroundSync.getInstance()
    this.startUsageTracking()
    this.startBillingMonitoring()
  }

  public static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager()
    }
    return SubscriptionManager.instance
  }

  // Subscription Plans
  public async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch("/api/billing/plans")
      if (!response.ok) throw new Error("Failed to fetch plans")
      return await response.json()
    } catch (error) {
      console.error("Failed to get plans:", error)
      return this.getDefaultPlans()
    }
  }

  public async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId: string,
    trialDays?: number,
  ): Promise<Subscription> {
    try {
      const response = await fetch("/api/billing/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId, paymentMethodId, trialDays }),
      })

      if (!response.ok) throw new Error("Failed to create subscription")
      return await response.json()
    } catch (error) {
      console.error("Failed to create subscription:", error)
      throw error
    }
  }

  public async updateSubscription(subscriptionId: string, planId: string): Promise<Subscription> {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) throw new Error("Failed to update subscription")
      return await response.json()
    } catch (error) {
      console.error("Failed to update subscription:", error)
      throw error
    }
  }

  public async cancelSubscription(subscriptionId: string, immediately = false): Promise<Subscription> {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ immediately }),
      })

      if (!response.ok) throw new Error("Failed to cancel subscription")
      return await response.json()
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
      throw error
    }
  }

  public async pauseSubscription(subscriptionId: string, resumeAt?: string): Promise<Subscription> {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeAt }),
      })

      if (!response.ok) throw new Error("Failed to pause subscription")
      return await response.json()
    } catch (error) {
      console.error("Failed to pause subscription:", error)
      throw error
    }
  }

  public async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionId}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Failed to resume subscription")
      return await response.json()
    } catch (error) {
      console.error("Failed to resume subscription:", error)
      throw error
    }
  }

  // Usage Tracking
  public trackUsage(
    subscriptionId: string,
    userId: string,
    metric: string,
    quantity: number,
    metadata: Record<string, any> = {},
  ): void {
    const usage: UsageRecord = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subscriptionId,
      userId,
      metric,
      quantity,
      timestamp: new Date().toISOString(),
      metadata,
    }

    this.notifyUsageListeners(usage)

    // Add to background sync queue
    this.backgroundSync.addToSyncQueue({
      type: "usage_record",
      action: "track",
      data: usage,
    })
  }

  public async getUsage(subscriptionId: string, dateRange: { start: string; end: string }): Promise<UsageRecord[]> {
    try {
      const response = await fetch(
        `/api/billing/usage?subscriptionId=${subscriptionId}&start=${dateRange.start}&end=${dateRange.end}`,
      )
      if (!response.ok) throw new Error("Failed to fetch usage")
      return await response.json()
    } catch (error) {
      console.error("Failed to get usage:", error)
      return []
    }
  }

  // Billing and Invoices
  public async getInvoices(userId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(`/api/billing/invoices?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch invoices")
      return await response.json()
    } catch (error) {
      console.error("Failed to get invoices:", error)
      return []
    }
  }

  public async downloadInvoice(invoiceId: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/download`)
      if (!response.ok) throw new Error("Failed to download invoice")
      return await response.blob()
    } catch (error) {
      console.error("Failed to download invoice:", error)
      throw error
    }
  }

  public async retryPayment(invoiceId: string): Promise<Invoice> {
    try {
      const response = await fetch(`/api/billing/invoices/${invoiceId}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Failed to retry payment")
      return await response.json()
    } catch (error) {
      console.error("Failed to retry payment:", error)
      throw error
    }
  }

  // Billing Alerts
  public async getBillingAlerts(userId: string): Promise<BillingAlert[]> {
    try {
      const response = await fetch(`/api/billing/alerts?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch alerts")
      return await response.json()
    } catch (error) {
      console.error("Failed to get billing alerts:", error)
      return []
    }
  }

  public async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const response = await fetch(`/api/billing/alerts/${alertId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Failed to mark alert as read")
    } catch (error) {
      console.error("Failed to mark alert as read:", error)
      throw error
    }
  }

  // Proration and Credits
  public async calculateProration(
    subscriptionId: string,
    newPlanId: string,
  ): Promise<{ amount: number; description: string }> {
    try {
      const response = await fetch("/api/billing/proration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, newPlanId }),
      })

      if (!response.ok) throw new Error("Failed to calculate proration")
      return await response.json()
    } catch (error) {
      console.error("Failed to calculate proration:", error)
      return { amount: 0, description: "Unable to calculate proration" }
    }
  }

  public async addCredit(userId: string, amount: number, reason: string): Promise<void> {
    try {
      const response = await fetch("/api/billing/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, reason }),
      })

      if (!response.ok) throw new Error("Failed to add credit")
    } catch (error) {
      console.error("Failed to add credit:", error)
      throw error
    }
  }

  // Tax and Compliance
  public async calculateTax(amount: number, country: string, state?: string): Promise<number> {
    try {
      const response = await fetch("/api/billing/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, country, state }),
      })

      if (!response.ok) throw new Error("Failed to calculate tax")
      const { tax } = await response.json()
      return tax
    } catch (error) {
      console.error("Failed to calculate tax:", error)
      return 0
    }
  }

  // Event Listeners
  public onUsage(callback: (usage: UsageRecord) => void): () => void {
    this.usageListeners.push(callback)
    return () => {
      this.usageListeners = this.usageListeners.filter((cb) => cb !== callback)
    }
  }

  public onBillingAlert(callback: (alert: BillingAlert) => void): () => void {
    this.billingListeners.push(callback)
    return () => {
      this.billingListeners = this.billingListeners.filter((cb) => cb !== callback)
    }
  }

  // Private methods
  private startUsageTracking(): void {
    // Track usage metrics periodically
    setInterval(() => {
      this.syncUsageMetrics()
    }, 60000) // Every minute
  }

  private startBillingMonitoring(): void {
    // Monitor billing events
    setInterval(() => {
      this.checkBillingAlerts()
    }, 300000) // Every 5 minutes
  }

  private async syncUsageMetrics(): Promise<void> {
    try {
      await fetch("/api/billing/usage/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Failed to sync usage metrics:", error)
    }
  }

  private async checkBillingAlerts(): Promise<void> {
    try {
      const response = await fetch("/api/billing/alerts/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const alerts = await response.json()
        alerts.forEach((alert: BillingAlert) => {
          this.notifyBillingListeners(alert)
        })
      }
    } catch (error) {
      console.error("Failed to check billing alerts:", error)
    }
  }

  private notifyUsageListeners(usage: UsageRecord): void {
    this.usageListeners.forEach((listener) => listener(usage))
  }

  private notifyBillingListeners(alert: BillingAlert): void {
    this.billingListeners.forEach((listener) => listener(alert))
  }

  private getDefaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: "starter",
        name: "Starter",
        description: "Perfect for trying out RunAsh AI",
        price: 0,
        yearlyPrice: 0,
        currency: "USD",
        interval: "monthly",
        features: [
          "720p AI Enhancement",
          "Basic Chat Moderation",
          "5 Hours Monthly Streaming",
          "Single Platform Streaming",
          "Community Support",
          "Basic Analytics",
        ],
        limits: {
          streamingHours: 5,
          platforms: 1,
          resolution: "720p",
          storage: 1,
          bandwidth: 10,
          apiCalls: 1000,
        },
        isPopular: false,
        isEnterprise: false,
        trialDays: 0,
      },
      {
        id: "professional",
        name: "Professional",
        description: "For serious content creators",
        price: 29,
        yearlyPrice: 23,
        currency: "USD",
        interval: "monthly",
        features: [
          "1080p AI Enhancement",
          "Advanced Chat Moderation",
          "50 Hours Monthly Streaming",
          "Multi-platform Streaming (3 platforms)",
          "Custom Overlays & Backgrounds",
          "Priority Support",
          "Advanced Analytics",
          "Stream Recording",
          "API Access",
        ],
        limits: {
          streamingHours: 50,
          platforms: 3,
          resolution: "1080p",
          storage: 50,
          bandwidth: 500,
          apiCalls: 10000,
        },
        isPopular: true,
        isEnterprise: false,
        trialDays: 14,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For teams and businesses",
        price: 99,
        yearlyPrice: 79,
        currency: "USD",
        interval: "monthly",
        features: [
          "4K AI Enhancement",
          "Premium Chat Moderation",
          "Unlimited Streaming",
          "Unlimited Platform Streaming",
          "Custom Branding",
          "24/7 Dedicated Support",
          "Advanced Analytics & Reports",
          "Team Management",
          "Custom Integrations",
          "SLA Guarantee",
          "Dedicated Account Manager",
        ],
        limits: {
          streamingHours: -1, // Unlimited
          platforms: -1, // Unlimited
          resolution: "4K",
          storage: 1000,
          bandwidth: 10000,
          apiCalls: 100000,
        },
        isPopular: false,
        isEnterprise: true,
        trialDays: 30,
      },
    ]
  }

  // Utility methods
  public isUsageLimitReached(usage: number, limit: number): boolean {
    if (limit === -1) return false // Unlimited
    return usage >= limit
  }

  public calculateUsagePercentage(usage: number, limit: number): number {
    if (limit === -1) return 0 // Unlimited
    return Math.min((usage / limit) * 100, 100)
  }

  public getNextBillingDate(subscription: Subscription): Date {
    return new Date(subscription.currentPeriodEnd)
  }

  public getDaysUntilBilling(subscription: Subscription): number {
    const nextBilling = this.getNextBillingDate(subscription)
    const now = new Date()
    const diffTime = nextBilling.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
