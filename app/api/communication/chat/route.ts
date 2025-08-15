import { type NextRequest, NextResponse } from "next/server"
import { CommunicationManager } from "@/lib/communication-manager"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const communicationManager = new CommunicationManager()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get("streamId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!streamId) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    const messages = await communicationManager.getChatMessages(streamId, limit)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { streamId, message, type } = await request.json()

    if (!streamId || !message) {
      return NextResponse.json({ error: "Stream ID and message required" }, { status: 400 })
    }

    const chatMessage = await communicationManager.sendChatMessage(streamId, session.user.id, message, type)

    return NextResponse.json({ message: chatMessage })
  } catch (error) {
    console.error("Error sending chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
