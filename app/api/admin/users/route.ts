import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { isAdmin, hasPermission, logAdminActivity } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await hasPermission("user_management"))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (search) {
      whereClause += ` AND (u.name ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 2})`
      params.push(`%${search}%`, `%${search}%`)
    }

    if (status === "verified") {
      whereClause += ` AND u.email_verified = true`
    } else if (status === "unverified") {
      whereClause += ` AND u.email_verified = false`
    }

    // Get users with subscription info
    const users = await sql`
      SELECT 
        u.*,
        us.status as subscription_status,
        sp.name as plan_name,
        COUNT(*) OVER() as total_count
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      ${sql.unsafe(whereClause)}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalCount = users.length > 0 ? users[0].total_count : 0

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        email_verified: user.email_verified,
        subscription_status: user.subscription_status,
        plan_name: user.plan_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(await hasPermission("user_management"))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, action, reason } = body

    let result
    switch (action) {
      case "verify_email":
        result = await sql`
          UPDATE users 
          SET email_verified = true, email_verified_at = NOW()
          WHERE id = ${userId}
          RETURNING *
        `
        await logAdminActivity("user_email_verified", "user", userId, { reason })
        break

      case "suspend":
        // In a real app, you'd have a user_status field
        await logAdminActivity("user_suspended", "user", userId, { reason })
        result = [{ id: userId, status: "suspended" }]
        break

      case "unsuspend":
        await logAdminActivity("user_unsuspended", "user", userId, { reason })
        result = [{ id: userId, status: "active" }]
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
