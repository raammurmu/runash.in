import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const [security] = await sql`
      SELECT * FROM user_security WHERE user_id = ${userId}
    `

    if (!security) {
      // Create default security settings if they don't exist
      const [newSecurity] = await sql`
        INSERT INTO user_security (user_id) 
        VALUES (${userId}) 
        RETURNING *
      `
      return NextResponse.json(newSecurity)
    }

    return NextResponse.json(security)
  } catch (error) {
    console.error("Error fetching user security:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const body = await request.json()

    const [updatedSecurity] = await sql`
      UPDATE user_security 
      SET 
        two_factor_enabled = ${body.two_factor_enabled || false},
        login_notifications = ${body.login_notifications !== undefined ? body.login_notifications : true},
        session_timeout = ${body.session_timeout !== undefined ? body.session_timeout : true},
        suspicious_activity_alerts = ${body.suspicious_activity_alerts !== undefined ? body.suspicious_activity_alerts : true},
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `

    return NextResponse.json(updatedSecurity)
  } catch (error) {
    console.error("Error updating user security:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
