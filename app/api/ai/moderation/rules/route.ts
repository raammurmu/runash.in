import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const rules = await sql`
      SELECT * FROM ai_moderation_rules 
      WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
      ORDER BY created_at DESC
    `

    return NextResponse.json(rules)
  } catch (error) {
    console.error("Error fetching moderation rules:", error)
    return NextResponse.json({ error: "Failed to fetch moderation rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, action, severity, settings } = await request.json()

    if (!name || !type || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO ai_moderation_rules (user_id, name, type, action, severity, settings)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        ${name},
        ${type},
        ${action},
        ${severity || "medium"},
        ${JSON.stringify(settings || {})}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating moderation rule:", error)
    return NextResponse.json({ error: "Failed to create moderation rule" }, { status: 500 })
  }
}
