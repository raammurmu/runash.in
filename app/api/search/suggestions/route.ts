import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Get suggestions from search documents
    const suggestions = await sql`
      SELECT DISTINCT title
      FROM search_documents
      WHERE LOWER(title) LIKE LOWER(${`%${query}%`})
      ORDER BY title
      LIMIT 5
    `

    // Get popular queries that match
    const popularQueries = await sql`
      SELECT DISTINCT query
      FROM search_queries
      WHERE LOWER(query) LIKE LOWER(${`%${query}%`})
      ORDER BY query
      LIMIT 3
    `

    const allSuggestions = [
      ...suggestions.map((row: any) => ({
        text: row.title,
        type: "content",
        score: 0.8,
      })),
      ...popularQueries.map((row: any) => ({
        text: row.query,
        type: "query",
        score: 0.9,
      })),
    ]

    // Remove duplicates and sort by score
    const uniqueSuggestions = allSuggestions
      .filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.text.toLowerCase() === suggestion.text.toLowerCase()),
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    return NextResponse.json({ suggestions: uniqueSuggestions })
  } catch (error) {
    console.error("Suggestions API error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
