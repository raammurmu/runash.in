import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const analytics = await aiSearchService.getSearchAnalytics(userId, days)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Search analytics API error:", error)
    return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 })
  }
}
