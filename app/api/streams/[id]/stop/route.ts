import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamId = params.id
    const stream = await Database.getStream(streamId)

    if (!stream || stream.user_id !== session.user.id) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 })
    }

    // Calculate stream duration
    const startTime = new Date(stream.start_time || Date.now())
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    // Update stream status to ended
    const updatedStream = await Database.updateStream(streamId, {
      status: "ended",
      end_time: endTime.toISOString(),
      duration,
    })

    // Finalize stream metrics
    await Database.finalizeStreamMetrics(streamId)

    // Broadcast stream end event
    console.log(`Stream ${streamId} ended by user ${session.user.id}`)

    return NextResponse.json({ stream: updatedStream })
  } catch (error) {
    console.error("Stop stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
