import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    // Get search analytics
    const analytics = await sql`
      SELECT 
        date,
        total_queries,
        unique_users,
        avg_response_time,
        top_queries,
        popular_content
      FROM search_analytics
      WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY date DESC
    `

    // Get top queries from recent searches
    const topQueries = await sql`
      SELECT query, COUNT(*) as count
      FROM search_queries
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY query
      ORDER BY count DESC
      LIMIT 10
    `

    // Get trending content
    const trendingContent = await sql`
      SELECT 
        sd.title,
        sd.content_type,
        sd.tags,
        COUNT(sq.id) as search_count
      FROM search_documents sd
      JOIN search_queries sq ON LOWER(sq.query) LIKE '%' || LOWER(sd.title) || '%'
      WHERE sq.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY sd.id, sd.title, sd.content_type, sd.tags
      ORDER BY search_count DESC
      LIMIT 5
    `

    return NextResponse.json({
      analytics: analytics[0] || null,
      topQueries: topQueries.map((row: any) => ({
        query: row.query,
        count: row.count,
      })),
      trendingContent: trendingContent.map((row: any) => ({
        title: row.title,
        contentType: row.content_type,
        tags: row.tags,
        searchCount: row.search_count,
      })),
      popular_queries: topQueries.map((row: any) => row.query).slice(0, 5),
      trending_content: trendingContent.map((row: any) => ({
        title: row.title,
        tags: row.tags,
      })),
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({
      analytics: null,
      topQueries: [],
      trendingContent: [],
      popular_queries: [],
      trending_content: [],
    })
  }
}
