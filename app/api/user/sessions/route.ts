import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE user_id = ${userId}
      ORDER BY last_active DESC
    `

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching user sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (sessionId) {
      // Delete specific session
      await sql`
        DELETE FROM user_sessions 
        WHERE id = ${sessionId} AND user_id = ${userId} AND is_current = false
      `
    } else {
      // Delete all other sessions (keep current)
      await sql`
        DELETE FROM user_sessions 
        WHERE user_id = ${userId} AND is_current = false
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
