import { BackgroundSync } from "./background-sync"

export interface AnalyticsEvent {
  id: string
  type:
    | "stream_start"
    | "stream_end"
    | "viewer_join"
    | "viewer_leave"
    | "chat_message"
    | "donation"
    | "subscription"
    | "purchase"
  userId: string
  streamId?: string
  timestamp: string
  data: Record<string, any>
  platform: string
  sessionId: string
}

export interface AnalyticsMetrics {
  totalViews: number
  uniqueViewers: number
  averageWatchTime: number
  peakViewers: number
  chatMessages: number
  engagementRate: number
  revenue: number
  conversionRate: number
  retentionRate: number
  bounceRate: number
}

export interface RealtimeMetrics {
  currentViewers: number
  chatMessagesPerMinute: number
  streamHealth: "excellent" | "good" | "fair" | "poor"
  bitrate: number
  fps: number
  droppedFrames: number
  networkLatency: number
}

export interface AnalyticsReport {
  id: string
  name: string
  type: "performance" | "audience" | "revenue" | "engagement" | "custom"
  dateRange: { start: string; end: string }
  filters: Record<string, any>
  metrics: AnalyticsMetrics
  charts: AnalyticsChart[]
  insights: AnalyticsInsight[]
  createdAt: string
  userId: string
}

export interface AnalyticsChart {
  id: string
  type: "line" | "bar" | "pie" | "area" | "scatter"
  title: string
  data: any[]
  config: Record<string, any>
}

export interface AnalyticsInsight {
  id: string
  type: "trend" | "anomaly" | "opportunity" | "warning"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  actionable: boolean
  recommendation?: string
}

export class AnalyticsManager {
  private static instance: AnalyticsManager
  private backgroundSync: BackgroundSync
  private eventListeners: ((event: AnalyticsEvent) => void)[] = []
  private metricsListeners: ((metrics: RealtimeMetrics) => void)[] = []
  private eventQueue: AnalyticsEvent[] = []
  private isProcessing = false

  private constructor() {
    this.backgroundSync = BackgroundSync.getInstance()
    this.startEventProcessor()
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  // Event tracking
  public trackEvent(
    type: AnalyticsEvent["type"],
    userId: string,
    data: Record<string, any> = {},
    streamId?: string,
    platform = "web",
  ): void {
    const event: AnalyticsEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId,
      streamId,
      timestamp: new Date().toISOString(),
      data,
      platform,
      sessionId: this.getSessionId(),
    }

    this.eventQueue.push(event)
    this.notifyEventListeners(event)

    // Add to background sync queue
    this.backgroundSync.addToSyncQueue({
      type: "analytics_event",
      action: "track",
      data: event,
    })
  }

  // Real-time metrics
  public async getRealtimeMetrics(streamId: string): Promise<RealtimeMetrics> {
    try {
      const response = await fetch(`/api/analytics/realtime?streamId=${streamId}`)
      if (!response.ok) throw new Error("Failed to fetch realtime metrics")

      const metrics = await response.json()
      this.notifyMetricsListeners(metrics)
      return metrics
    } catch (error) {
      console.error("Failed to get realtime metrics:", error)
      return this.getDefaultMetrics()
    }
  }

  // Historical analytics
  public async getAnalytics(
    userId: string,
    dateRange: { start: string; end: string },
    filters: Record<string, any> = {},
  ): Promise<AnalyticsMetrics> {
    try {
      const response = await fetch("/api/analytics/historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, dateRange, filters }),
      })

      if (!response.ok) throw new Error("Failed to fetch analytics")
      return await response.json()
    } catch (error) {
      console.error("Failed to get analytics:", error)
      throw error
    }
  }

  // Report generation
  public async generateReport(
    name: string,
    type: AnalyticsReport["type"],
    dateRange: { start: string; end: string },
    filters: Record<string, any> = {},
    userId: string,
  ): Promise<AnalyticsReport> {
    try {
      const response = await fetch("/api/analytics/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, dateRange, filters, userId }),
      })

      if (!response.ok) throw new Error("Failed to generate report")
      return await response.json()
    } catch (error) {
      console.error("Failed to generate report:", error)
      throw error
    }
  }

  // AI insights
  public async getAIInsights(userId: string, dateRange: { start: string; end: string }): Promise<AnalyticsInsight[]> {
    try {
      const response = await fetch("/api/analytics/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, dateRange }),
      })

      if (!response.ok) throw new Error("Failed to get AI insights")
      return await response.json()
    } catch (error) {
      console.error("Failed to get AI insights:", error)
      return []
    }
  }

  // Export functionality
  public async exportData(format: "csv" | "json" | "pdf", reportId: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&reportId=${reportId}`)
      if (!response.ok) throw new Error("Failed to export data")

      return await response.blob()
    } catch (error) {
      console.error("Failed to export data:", error)
      throw error
    }
  }

  // Custom metrics
  public async createCustomMetric(name: string, formula: string, userId: string): Promise<void> {
    try {
      const response = await fetch("/api/analytics/custom-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, formula, userId }),
      })

      if (!response.ok) throw new Error("Failed to create custom metric")
    } catch (error) {
      console.error("Failed to create custom metric:", error)
      throw error
    }
  }

  // A/B testing
  public async createABTest(name: string, variants: string[], metric: string, userId: string): Promise<string> {
    try {
      const response = await fetch("/api/analytics/ab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, variants, metric, userId }),
      })

      if (!response.ok) throw new Error("Failed to create A/B test")
      const { testId } = await response.json()
      return testId
    } catch (error) {
      console.error("Failed to create A/B test:", error)
      throw error
    }
  }

  // Event listeners
  public onEvent(callback: (event: AnalyticsEvent) => void): () => void {
    this.eventListeners.push(callback)
    return () => {
      this.eventListeners = this.eventListeners.filter((cb) => cb !== callback)
    }
  }

  public onMetricsUpdate(callback: (metrics: RealtimeMetrics) => void): () => void {
    this.metricsListeners.push(callback)
    return () => {
      this.metricsListeners = this.metricsListeners.filter((cb) => cb !== callback)
    }
  }

  // Private methods
  private startEventProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing && this.eventQueue.length > 0) {
        this.processEventQueue()
      }
    }, 1000)
  }

  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return

    this.isProcessing = true
    const batch = this.eventQueue.splice(0, 100) // Process in batches

    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: batch }),
      })
    } catch (error) {
      console.error("Failed to process event batch:", error)
      // Re-queue failed events
      this.eventQueue.unshift(...batch)
    } finally {
      this.isProcessing = false
    }
  }

  private notifyEventListeners(event: AnalyticsEvent): void {
    this.eventListeners.forEach((listener) => listener(event))
  }

  private notifyMetricsListeners(metrics: RealtimeMetrics): void {
    this.metricsListeners.forEach((listener) => listener(metrics))
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("analytics_session_id")
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("analytics_session_id", sessionId)
    }
    return sessionId
  }

  private getDefaultMetrics(): RealtimeMetrics {
    return {
      currentViewers: 0,
      chatMessagesPerMinute: 0,
      streamHealth: "good",
      bitrate: 0,
      fps: 0,
      droppedFrames: 0,
      networkLatency: 0,
    }
  }

  // Utility methods
  public calculateEngagementRate(chatMessages: number, viewers: number): number {
    if (viewers === 0) return 0
    return (chatMessages / viewers) * 100
  }

  public calculateRetentionRate(totalViewers: number, viewersWhoStayed: number): number {
    if (totalViewers === 0) return 0
    return (viewersWhoStayed / totalViewers) * 100
  }

  public calculateConversionRate(viewers: number, conversions: number): number {
    if (viewers === 0) return 0
    return (conversions / viewers) * 100
  }
}
