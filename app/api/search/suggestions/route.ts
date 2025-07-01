import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { aiSearchService } from "@/lib/ai-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const userId = isAuthenticated() ? getCurrentUserId() : undefined
    const suggestions = await aiSearchService.getSmartSuggestions(query, userId)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Suggestions API error:", error)
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 })
  }
}
