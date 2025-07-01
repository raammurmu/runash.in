import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { streamId, duration } = await request.json()

    if (!streamId || !duration) {
      return NextResponse.json({ error: "Missing required fields: streamId and duration" }, { status: 400 })
    }

    // Generate highlights using AI service
    const highlights = await aiService.generateHighlights(streamId, duration)

    // Save highlights to database
    for (const highlight of highlights) {
      await sql`
        INSERT INTO ai_highlights (
          stream_id, user_id, timestamp_start, duration, title, description,
          confidence, thumbnail_url, clip_url, tags, engagement_score, status
        ) VALUES (
          ${highlight.stream_id},
          '550e8400-e29b-41d4-a716-446655440000',
          ${highlight.timestamp},
          ${highlight.duration},
          ${highlight.title},
          ${highlight.description},
          ${highlight.confidence},
          ${highlight.thumbnail_url},
          ${highlight.clip_url},
          ${JSON.stringify(highlight.tags)},
          ${highlight.engagement_score},
          'pending'
        )
      `
    }

    // Update usage analytics
    await sql`
      INSERT INTO ai_usage_analytics (user_id, date, tool_type, usage_count, tokens_used, cost_usd)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        CURRENT_DATE,
        'highlights',
        ${highlights.length},
        0,
        0.00
      )
      ON CONFLICT (user_id, date, tool_type)
      DO UPDATE SET
        usage_count = ai_usage_analytics.usage_count + ${highlights.length}
    `

    return NextResponse.json({ highlights, count: highlights.length })
  } catch (error) {
    console.error("Highlight generation error:", error)
    return NextResponse.json({ error: "Failed to generate highlights" }, { status: 500 })
  }
}
