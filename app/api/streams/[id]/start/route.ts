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

    // Update stream status to live
    const updatedStream = await Database.updateStream(streamId, {
      status: "live",
      start_time: new Date().toISOString(),
      viewer_count: 0,
    })

    // Initialize stream metrics
    await Database.createStreamMetrics(streamId, {
      viewer_count: 0,
      stream_health: "Good",
      bitrate: stream.settings?.bitrate || 6000,
      fps: stream.settings?.fps || 60,
      dropped_frames: 0,
      bandwidth: 0,
    })

    // Broadcast stream start event
    // In a real implementation, this would use WebSocket or Server-Sent Events
    console.log(`Stream ${streamId} started by user ${session.user.id}`)

    return NextResponse.json({
      stream: updatedStream,
      rtmpUrl: generateRTMPUrl(stream.platform, stream.stream_key),
      hlsUrl: generateHLSUrl(streamId),
    })
  } catch (error) {
    console.error("Start stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateRTMPUrl(platform: string, streamKey: string): string {
  const rtmpServers = {
    twitch: "rtmp://live.twitch.tv/live/",
    youtube: "rtmp://a.rtmp.youtube.com/live2/",
    facebook: "rtmps://live-api-s.facebook.com:443/rtmp/",
  }

  const server = rtmpServers[platform as keyof typeof rtmpServers] || rtmpServers.twitch
  return `${server}${streamKey}`
}

function generateHLSUrl(streamId: string): string {
  return `${process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.example.com"}/streams/${streamId}/playlist.m3u8`
}
