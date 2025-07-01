import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const [notifications] = await sql`
      SELECT * FROM user_notifications WHERE user_id = ${userId}
    `

    if (!notifications) {
      // Create default notifications if they don't exist
      const [newNotifications] = await sql`
        INSERT INTO user_notifications (user_id) 
        VALUES (${userId}) 
        RETURNING *
      `
      return NextResponse.json(newNotifications)
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching user notifications:", error)
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

    const [updatedNotifications] = await sql`
      UPDATE user_notifications 
      SET 
        email_stream_start = ${body.email_stream_start !== undefined ? body.email_stream_start : true},
        email_new_follower = ${body.email_new_follower !== undefined ? body.email_new_follower : true},
        email_donations = ${body.email_donations !== undefined ? body.email_donations : true},
        email_weekly_report = ${body.email_weekly_report !== undefined ? body.email_weekly_report : true},
        email_security = ${body.email_security !== undefined ? body.email_security : true},
        email_marketing = ${body.email_marketing || false},
        push_stream_start = ${body.push_stream_start !== undefined ? body.push_stream_start : true},
        push_new_follower = ${body.push_new_follower || false},
        push_donations = ${body.push_donations !== undefined ? body.push_donations : true},
        push_chat_mentions = ${body.push_chat_mentions !== undefined ? body.push_chat_mentions : true},
        push_security = ${body.push_security !== undefined ? body.push_security : true},
        inapp_stream_start = ${body.inapp_stream_start !== undefined ? body.inapp_stream_start : true},
        inapp_new_follower = ${body.inapp_new_follower !== undefined ? body.inapp_new_follower : true},
        inapp_donations = ${body.inapp_donations !== undefined ? body.inapp_donations : true},
        inapp_chat_mentions = ${body.inapp_chat_mentions !== undefined ? body.inapp_chat_mentions : true},
        inapp_moderator_actions = ${body.inapp_moderator_actions !== undefined ? body.inapp_moderator_actions : true},
        notification_sounds = ${body.notification_sounds !== undefined ? body.notification_sounds : true},
        chat_sounds = ${body.chat_sounds || false},
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `

    return NextResponse.json(updatedNotifications)
  } catch (error) {
    console.error("Error updating user notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
