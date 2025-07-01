import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get usage analytics for the last 30 days
    const analytics = await sql`
      SELECT 
        tool_type,
        SUM(usage_count) as total_usage,
        SUM(tokens_used) as total_tokens,
        SUM(cost_usd) as total_cost,
        COUNT(DISTINCT date) as active_days
      FROM ai_usage_analytics 
      WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
        AND date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY tool_type
    `

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        'content' as type,
        type as subtype,
        content as title,
        created_at
      FROM ai_content_generations 
      WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
      
      UNION ALL
      
      SELECT 
        'highlight' as type,
        'auto' as subtype,
        title,
        created_at
      FROM ai_highlights 
      WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
      
      UNION ALL
      
      SELECT 
        'moderation' as type,
        action_taken as subtype,
        CONCAT('Moderated: ', LEFT(message, 50)) as title,
        created_at
      FROM ai_moderation_events 
      WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
      
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Calculate summary stats
    const totalUsage = analytics.reduce((sum, item) => sum + Number.parseInt(item.total_usage), 0)
    const totalTokens = analytics.reduce((sum, item) => sum + Number.parseInt(item.total_tokens), 0)
    const totalCost = analytics.reduce((sum, item) => sum + Number.parseFloat(item.total_cost), 0)

    return NextResponse.json({
      analytics,
      recentActivity,
      summary: {
        totalUsage,
        totalTokens,
        totalCost,
        activeTools: analytics.length,
      },
    })
  } catch (error) {
    console.error("Error fetching AI analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
