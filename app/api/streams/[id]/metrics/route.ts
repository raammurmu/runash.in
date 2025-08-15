import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamId = params.id
    const metrics = await Database.getStreamMetrics(streamId)

    if (!metrics) {
      return NextResponse.json({ error: "Metrics not found" }, { status: 404 })
    }

    // Add real-time calculated metrics
    const enhancedMetrics = {
      ...metrics,
      streamHealth: calculateStreamHealth(metrics),
      networkLatency: await getNetworkLatency(),
      cpuUsage: await getCPUUsage(),
      memoryUsage: await getMemoryUsage(),
    }

    return NextResponse.json(enhancedMetrics)
  } catch (error) {
    console.error("Get metrics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamId = params.id
    const metricsData = await req.json()

    // Update stream metrics
    await Database.updateStreamMetrics(streamId, {
      ...metricsData,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update metrics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateStreamHealth(metrics: any): string {
  const { bitrate, fps, dropped_frames, bandwidth } = metrics

  let score = 100

  // Deduct points for dropped frames
  if (dropped_frames > 0) {
    score -= Math.min(dropped_frames * 2, 30)
  }

  // Deduct points for low bitrate
  if (bitrate < 3000) {
    score -= 20
  }

  // Deduct points for low FPS
  if (fps < 30) {
    score -= 15
  }

  // Deduct points for insufficient bandwidth
  if (bandwidth < bitrate * 1.2) {
    score -= 25
  }

  if (score >= 90) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 50) return "Fair"
  return "Poor"
}

async function getNetworkLatency(): Promise<number> {
  // Simulate network latency measurement
  return Math.floor(Math.random() * 50) + 10
}

async function getCPUUsage(): Promise<number> {
  // Simulate CPU usage measurement
  return Math.floor(Math.random() * 30) + 20
}

async function getMemoryUsage(): Promise<number> {
  // Simulate memory usage measurement
  return Math.floor(Math.random() * 40) + 30
}
