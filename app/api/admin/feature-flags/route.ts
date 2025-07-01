import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { isAdmin, hasPermission, logAdminActivity } from "@/lib/admin-auth"

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const flags = await sql`
      SELECT * FROM feature_flags 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ flags })
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await hasPermission("system_settings"))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { flagId, isEnabled, rolloutPercentage } = body

    const result = await sql`
      UPDATE feature_flags 
      SET 
        is_enabled = ${isEnabled},
        rollout_percentage = ${rolloutPercentage || 0},
        updated_at = NOW()
      WHERE id = ${flagId}
      RETURNING *
    `

    await logAdminActivity("feature_flag_updated", "feature_flag", flagId, {
      is_enabled: isEnabled,
      rollout_percentage: rolloutPercentage,
    })

    return NextResponse.json({ flag: result[0] })
  } catch (error) {
    console.error("Error updating feature flag:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
