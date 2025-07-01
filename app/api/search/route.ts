import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { aiSearchService } from "@/lib/ai-search"
import type { SearchOptions } from "@/lib/search-types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const userId = isAuthenticated() ? getCurrentUserId() : undefined

    const searchOptions: SearchOptions = {
      query,
      type: (searchParams.get("type") as any) || "semantic",
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
      filters: {},
    }

    // Parse filters
    const documentTypes = searchParams.get("document_types")
    if (documentTypes) {
      searchOptions.filters!.document_type = documentTypes.split(",")
    }

    const tags = searchParams.get("tags")
    if (tags) {
      searchOptions.filters!.tags = tags.split(",")
    }

    const isPublic = searchParams.get("is_public")
    if (isPublic !== null) {
      searchOptions.filters!.is_public = isPublic === "true"
    }

    const dateStart = searchParams.get("date_start")
    const dateEnd = searchParams.get("date_end")
    if (dateStart && dateEnd) {
      searchOptions.filters!.date_range = {
        start: dateStart,
        end: dateEnd,
      }
    }

    const results = await aiSearchService.search(searchOptions, userId)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const body = await request.json()

    const searchOptions: SearchOptions = {
      query: body.query,
      type: body.type || "semantic",
      limit: body.limit || 20,
      offset: body.offset || 0,
      filters: body.filters || {},
    }

    const results = await aiSearchService.search(searchOptions, userId)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
