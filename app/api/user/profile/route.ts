import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
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

    const { name, username, bio, website, location, avatar_url } = body

    const [updatedUser] = await sql`
      UPDATE users 
      SET 
        name = ${name},
        username = ${username},
        bio = ${bio},
        website = ${website},
        location = ${location},
        avatar_url = ${avatar_url},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
