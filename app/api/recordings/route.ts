import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"
import { CloudStorage } from "@/lib/cloud-storage"

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

    const recordings = await Database.getRecordings(streamId)

    // Generate signed URLs for each recording
    const recordingsWithUrls = await Promise.all(
      recordings.map(async (recording) => {
        const signedUrl = await CloudStorage.getSignedDownloadUrl(
          recording.file_url
            .split("/")
            .slice(-2)
            .join("/"), // Extract key from URL
          3600, // 1 hour expiry
        )

        return {
          ...recording,
          playback_url: signedUrl,
        }
      }),
    )

    return NextResponse.json({ recordings: recordingsWithUrls })
  } catch (error) {
    console.error("Get recordings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
