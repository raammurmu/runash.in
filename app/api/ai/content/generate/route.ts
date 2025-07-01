import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"
import type { ContentGenerationRequest } from "@/lib/ai-types"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json()

    // Validate request
    if (!body.type || !body.context) {
      return NextResponse.json({ error: "Missing required fields: type and context" }, { status: 400 })
    }

    // Generate content using AI service
    const result = await aiService.generateContent(body)

    // Save to database
    await sql`
      INSERT INTO ai_content_generations (
        user_id, type, prompt, content, alternatives, confidence, tokens_used
      ) VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        ${result.type},
        ${body.context},
        ${result.content},
        ${JSON.stringify(result.alternatives)},
        ${result.confidence},
        ${result.usage_tokens}
      )
    `

    // Update usage analytics
    await sql`
      INSERT INTO ai_usage_analytics (user_id, date, tool_type, usage_count, tokens_used, cost_usd)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        CURRENT_DATE,
        'content',
        1,
        ${result.usage_tokens},
        ${result.usage_tokens * 0.0003}
      )
      ON CONFLICT (user_id, date, tool_type)
      DO UPDATE SET
        usage_count = ai_usage_analytics.usage_count + 1,
        tokens_used = ai_usage_analytics.tokens_used + ${result.usage_tokens},
        cost_usd = ai_usage_analytics.cost_usd + ${result.usage_tokens * 0.0003}
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
