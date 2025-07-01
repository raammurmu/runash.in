import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { isAdmin, logAdminActivity } from "@/lib/admin-auth"

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const alerts = await sql`
      SELECT * FROM system_alerts 
      ORDER BY severity DESC, created_at DESC
      LIMIT 50
    `

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { alertId, action } = body

    if (action === "resolve") {
      const result = await sql`
        UPDATE system_alerts 
        SET is_resolved = true, resolved_at = NOW()
        WHERE id = ${alertId}
        RETURNING *
      `

      await logAdminActivity("alert_resolved", "alert", alertId)
      return NextResponse.json({ alert: result[0] })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
