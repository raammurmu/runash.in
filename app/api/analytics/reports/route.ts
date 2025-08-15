import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, type, dateRange, filters, userId } = await req.json()

    // Generate comprehensive report
    const report = await generateAnalyticsReport({
      name,
      type,
      dateRange,
      filters,
      userId: session.user.id,
    })

    // Save report to database
    const savedReport = await Database.saveAnalyticsReport(report)

    return NextResponse.json(savedReport)
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reports = await Database.getUserReports(session.user.id)
    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Get reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateAnalyticsReport(params: {
  name: string
  type: string
  dateRange: { start: string; end: string }
  filters: Record<string, any>
  userId: string
}) {
  const { name, type, dateRange, filters, userId } = params

  // Fetch analytics data
  const analyticsData = await Database.getAnalyticsData(userId, dateRange, filters)

  // Generate metrics
  const metrics = calculateMetrics(analyticsData)

  // Generate charts based on report type
  const charts = generateCharts(type, analyticsData)

  // Generate AI insights
  const insights = await generateInsights(analyticsData, metrics)

  return {
    id: `report-${Date.now()}`,
    name,
    type,
    dateRange,
    filters,
    metrics,
    charts,
    insights,
    createdAt: new Date().toISOString(),
    userId,
  }
}

function calculateMetrics(data: any) {
  return {
    totalViews: data.events.filter((e: any) => e.type === "viewer_join").length,
    uniqueViewers: new Set(data.events.map((e: any) => e.userId)).size,
    averageWatchTime: calculateAverageWatchTime(data.events),
    peakViewers: calculatePeakViewers(data.events),
    chatMessages: data.events.filter((e: any) => e.type === "chat_message").length,
    engagementRate: calculateEngagementRate(data.events),
    revenue: calculateRevenue(data.events),
    conversionRate: calculateConversionRate(data.events),
    retentionRate: calculateRetentionRate(data.events),
    bounceRate: calculateBounceRate(data.events),
  }
}

function generateCharts(type: string, data: any) {
  const charts = []

  switch (type) {
    case "performance":
      charts.push(
        {
          id: "viewer-trends",
          type: "line",
          title: "Viewer Trends",
          data: generateViewerTrendsData(data),
          config: { xAxis: "timestamp", yAxis: "viewers" },
        },
        {
          id: "engagement-metrics",
          type: "bar",
          title: "Engagement Metrics",
          data: generateEngagementData(data),
          config: { xAxis: "metric", yAxis: "value" },
        },
      )
      break

    case "revenue":
      charts.push(
        {
          id: "revenue-breakdown",
          type: "pie",
          title: "Revenue Breakdown",
          data: generateRevenueBreakdown(data),
          config: { valueKey: "amount", labelKey: "source" },
        },
        {
          id: "revenue-trends",
          type: "area",
          title: "Revenue Trends",
          data: generateRevenueTrends(data),
          config: { xAxis: "date", yAxis: "revenue" },
        },
      )
      break

    case "audience":
      charts.push({
        id: "demographics",
        type: "bar",
        title: "Audience Demographics",
        data: generateDemographicsData(data),
        config: { xAxis: "category", yAxis: "percentage" },
      })
      break
  }

  return charts
}

async function generateInsights(data: any, metrics: any) {
  // AI-powered insights generation
  const insights = []

  // Trend analysis
  if (metrics.totalViews > 0) {
    const viewerGrowth = calculateGrowthRate(data.events, "viewer_join")
    if (viewerGrowth > 20) {
      insights.push({
        id: "viewer-growth",
        type: "trend",
        title: "Strong Viewer Growth",
        description: `Your viewer count has grown by ${viewerGrowth.toFixed(1)}% in this period.`,
        confidence: 95,
        impact: "high",
        actionable: true,
        recommendation: "Consider increasing your streaming frequency to capitalize on this growth.",
      })
    }
  }

  // Engagement analysis
  if (metrics.engagementRate < 5) {
    insights.push({
      id: "low-engagement",
      type: "warning",
      title: "Low Engagement Rate",
      description: "Your engagement rate is below average. Consider more interactive content.",
      confidence: 85,
      impact: "medium",
      actionable: true,
      recommendation: "Add polls, Q&A sessions, or interactive games to boost engagement.",
    })
  }

  // Revenue opportunities
  if (metrics.conversionRate < 2) {
    insights.push({
      id: "conversion-opportunity",
      type: "opportunity",
      title: "Conversion Rate Opportunity",
      description: "There's potential to improve your conversion rate with better call-to-actions.",
      confidence: 78,
      impact: "high",
      actionable: true,
      recommendation: "Implement clearer product showcases and limited-time offers.",
    })
  }

  return insights
}

// Helper functions
function calculateAverageWatchTime(events: any[]): number {
  const sessions = new Map()

  events.forEach((event) => {
    if (event.type === "viewer_join") {
      sessions.set(event.userId, event.timestamp)
    } else if (event.type === "viewer_leave" && sessions.has(event.userId)) {
      const joinTime = new Date(sessions.get(event.userId)).getTime()
      const leaveTime = new Date(event.timestamp).getTime()
      const watchTime = (leaveTime - joinTime) / 1000 / 60 // minutes
      sessions.set(event.userId, watchTime)
    }
  })

  const watchTimes = Array.from(sessions.values()).filter((time) => typeof time === "number")
  return watchTimes.length > 0 ? watchTimes.reduce((sum, time) => sum + time, 0) / watchTimes.length : 0
}

function calculatePeakViewers(events: any[]): number {
  const viewerCounts = new Map()
  let currentViewers = 0
  let peakViewers = 0

  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  events.forEach((event) => {
    if (event.type === "viewer_join") {
      currentViewers++
    } else if (event.type === "viewer_leave") {
      currentViewers--
    }
    peakViewers = Math.max(peakViewers, currentViewers)
  })

  return peakViewers
}

function calculateEngagementRate(events: any[]): number {
  const chatMessages = events.filter((e) => e.type === "chat_message").length
  const uniqueViewers = new Set(events.map((e) => e.userId)).size
  return uniqueViewers > 0 ? (chatMessages / uniqueViewers) * 100 : 0
}

function calculateRevenue(events: any[]): number {
  return events
    .filter((e) => e.type === "donation" || e.type === "subscription" || e.type === "purchase")
    .reduce((sum, e) => sum + (e.data.amount || 0), 0)
}

function calculateConversionRate(events: any[]): number {
  const viewers = new Set(events.map((e) => e.userId)).size
  const conversions = events.filter((e) => e.type === "purchase").length
  return viewers > 0 ? (conversions / viewers) * 100 : 0
}

function calculateRetentionRate(events: any[]): number {
  const joinEvents = events.filter((e) => e.type === "viewer_join")
  const leaveEvents = events.filter((e) => e.type === "viewer_leave")

  if (joinEvents.length === 0) return 0

  const stayedViewers = joinEvents.length - leaveEvents.length
  return (stayedViewers / joinEvents.length) * 100
}

function calculateBounceRate(events: any[]): number {
  // Calculate percentage of viewers who left within 30 seconds
  const sessions = new Map()
  let bounces = 0

  events.forEach((event) => {
    if (event.type === "viewer_join") {
      sessions.set(event.userId, event.timestamp)
    } else if (event.type === "viewer_leave" && sessions.has(event.userId)) {
      const joinTime = new Date(sessions.get(event.userId)).getTime()
      const leaveTime = new Date(event.timestamp).getTime()
      const sessionDuration = (leaveTime - joinTime) / 1000 // seconds

      if (sessionDuration <= 30) {
        bounces++
      }
    }
  })

  return sessions.size > 0 ? (bounces / sessions.size) * 100 : 0
}

function calculateGrowthRate(events: any[], eventType: string): number {
  // Simple growth rate calculation
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000

  const recentEvents = events.filter((e) => e.type === eventType && new Date(e.timestamp).getTime() > oneWeekAgo).length

  const olderEvents = events.filter((e) => e.type === eventType && new Date(e.timestamp).getTime() <= oneWeekAgo).length

  if (olderEvents === 0) return recentEvents > 0 ? 100 : 0
  return ((recentEvents - olderEvents) / olderEvents) * 100
}

function generateViewerTrendsData(data: any) {
  // Generate viewer trends chart data
  return data.events
    .filter((e: any) => e.type === "viewer_join" || e.type === "viewer_leave")
    .reduce((acc: any[], event: any) => {
      const date = event.timestamp.split("T")[0]
      const existing = acc.find((item) => item.timestamp === date)

      if (existing) {
        existing.viewers += event.type === "viewer_join" ? 1 : -1
      } else {
        acc.push({
          timestamp: date,
          viewers: event.type === "viewer_join" ? 1 : 0,
        })
      }

      return acc
    }, [])
}

function generateEngagementData(data: any) {
  const chatMessages = data.events.filter((e: any) => e.type === "chat_message").length
  const donations = data.events.filter((e: any) => e.type === "donation").length
  const subscriptions = data.events.filter((e: any) => e.type === "subscription").length

  return [
    { metric: "Chat Messages", value: chatMessages },
    { metric: "Donations", value: donations },
    { metric: "Subscriptions", value: subscriptions },
  ]
}

function generateRevenueBreakdown(data: any) {
  const donations = data.events
    .filter((e: any) => e.type === "donation")
    .reduce((sum: number, e: any) => sum + (e.data.amount || 0), 0)

  const subscriptions = data.events
    .filter((e: any) => e.type === "subscription")
    .reduce((sum: number, e: any) => sum + (e.data.amount || 0), 0)

  const purchases = data.events
    .filter((e: any) => e.type === "purchase")
    .reduce((sum: number, e: any) => sum + (e.data.amount || 0), 0)

  return [
    { source: "Donations", amount: donations },
    { source: "Subscriptions", amount: subscriptions },
    { source: "Purchases", amount: purchases },
  ]
}

function generateRevenueTrends(data: any) {
  return data.events
    .filter((e: any) => e.type === "donation" || e.type === "subscription" || e.type === "purchase")
    .reduce((acc: any[], event: any) => {
      const date = event.timestamp.split("T")[0]
      const existing = acc.find((item) => item.date === date)

      if (existing) {
        existing.revenue += event.data.amount || 0
      } else {
        acc.push({
          date,
          revenue: event.data.amount || 0,
        })
      }

      return acc
    }, [])
}

function generateDemographicsData(data: any) {
  // Mock demographics data - in real implementation, this would come from user profiles
  return [
    { category: "18-24", percentage: 35 },
    { category: "25-34", percentage: 42 },
    { category: "35-44", percentage: 15 },
    { category: "45+", percentage: 8 },
  ]
}
