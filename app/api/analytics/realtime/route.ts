import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const streamId = searchParams.get("streamId")

    if (!streamId) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    // Get real-time metrics from database
    const metrics = await Database.getRealtimeMetrics(streamId)

    // Calculate additional metrics
    const enhancedMetrics = {
      ...metrics,
      streamHealth: calculateStreamHealth(metrics),
      engagementRate: calculateEngagementRate(metrics.chatMessagesPerMinute, metrics.currentViewers),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(enhancedMetrics)
  } catch (error) {
    console.error("Realtime analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateStreamHealth(metrics: any): string {
  let score = 100

  // Deduct points for technical issues
  if (metrics.droppedFrames > 0) {
    score -= Math.min(metrics.droppedFrames * 2, 30)
  }

  if (metrics.bitrate < 3000) {
    score -= 20
  }

  if (metrics.fps < 30) {
    score -= 15
  }

  if (metrics.networkLatency > 100) {
    score -= 25
  }

  if (score >= 90) return "excellent"
  if (score >= 70) return "good"
  if (score >= 50) return "fair"
  return "poor"
}

function calculateEngagementRate(chatMessages: number, viewers: number): number {
  if (viewers === 0) return 0
  return Math.round((chatMessages / viewers) * 100 * 100) / 100
}
