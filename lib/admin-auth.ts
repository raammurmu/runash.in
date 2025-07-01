// Admin authentication and authorization helpers

import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"

export async function isAdmin(): Promise<boolean> {
  if (!isAuthenticated()) {
    return false
  }

  const userId = getCurrentUserId()

  try {
    const adminUsers = await sql`
      SELECT id FROM admin_users 
      WHERE user_id = ${Number.parseInt(userId)}
      AND role IN ('admin', 'super_admin', 'moderator')
    `

    return adminUsers.length > 0
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function hasPermission(permission: string): Promise<boolean> {
  if (!isAuthenticated()) {
    return false
  }

  const userId = getCurrentUserId()

  try {
    const adminUsers = await sql`
      SELECT permissions FROM admin_users 
      WHERE user_id = ${Number.parseInt(userId)}
      AND role IN ('admin', 'super_admin', 'moderator')
    `

    if (adminUsers.length === 0) {
      return false
    }

    const permissions = adminUsers[0].permissions as string[]
    return permissions.includes(permission) || permissions.includes("*")
  } catch (error) {
    console.error("Error checking permission:", error)
    return false
  }
}

export async function logAdminActivity(
  action: string,
  targetType?: string,
  targetId?: number,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  if (!isAuthenticated()) {
    return
  }

  const userId = getCurrentUserId()

  try {
    const adminUsers = await sql`
      SELECT id FROM admin_users 
      WHERE user_id = ${Number.parseInt(userId)}
    `

    if (adminUsers.length === 0) {
      return
    }

    const adminId = adminUsers[0].id

    await sql`
      INSERT INTO admin_activity_logs (
        admin_id, action, target_type, target_id, details, ip_address, user_agent
      ) VALUES (
        ${adminId}, ${action}, ${targetType}, ${targetId}, 
        ${JSON.stringify(details)}, ${ipAddress}, ${userAgent}
      )
    `
  } catch (error) {
    console.error("Error logging admin activity:", error)
  }
}
