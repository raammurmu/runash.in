import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ChatMessage {
  id: string
  streamId: string
  userId: string
  username: string
  message: string
  timestamp: Date
  type: "message" | "system" | "purchase" | "alert"
  metadata?: any
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: "stream_start" | "new_follower" | "chat_mention" | "system" | "support"
  title: string
  message: string
  read: boolean
  createdAt: Date
  metadata?: any
}

export class CommunicationManager {
  async sendChatMessage(streamId: string, userId: string, message: string, type: ChatMessage["type"] = "message") {
    const chatMessage = await sql`
      INSERT INTO chat_messages (stream_id, user_id, message, type, created_at)
      VALUES (${streamId}, ${userId}, ${message}, ${type}, NOW())
      RETURNING *
    `

    // Broadcast to WebSocket connections
    await this.broadcastToStream(streamId, {
      type: "chat_message",
      data: chatMessage[0],
    })

    return chatMessage[0]
  }

  async getChatMessages(streamId: string, limit = 50) {
    return await sql`
      SELECT cm.*, u.username, u.avatar_url
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.stream_id = ${streamId}
      ORDER BY cm.created_at DESC
      LIMIT ${limit}
    `
  }

  async createSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) {
    const result = await sql`
      INSERT INTO support_tickets (user_id, subject, description, status, priority, category, created_at, updated_at)
      VALUES (${ticket.userId}, ${ticket.subject}, ${ticket.description}, ${ticket.status}, ${ticket.priority}, ${ticket.category}, NOW(), NOW())
      RETURNING *
    `

    // Send notification to support team
    await this.createNotification({
      userId: "support-team",
      type: "support",
      title: "New Support Ticket",
      message: `New ${ticket.priority} priority ticket: ${ticket.subject}`,
      read: false,
      createdAt: new Date(),
    })

    return result[0]
  }

  async updateSupportTicket(ticketId: string, updates: Partial<SupportTicket>) {
    return await sql`
      UPDATE support_tickets 
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${ticketId}
      RETURNING *
    `
  }

  async getSupportTickets(userId?: string, status?: string) {
    let query = sql`SELECT * FROM support_tickets`

    if (userId) {
      query = sql`SELECT * FROM support_tickets WHERE user_id = ${userId}`
    }

    if (status) {
      query = sql`SELECT * FROM support_tickets WHERE status = ${status}`
    }

    return await query
  }

  async createNotification(notification: Omit<Notification, "id">) {
    const result = await sql`
      INSERT INTO notifications (user_id, type, title, message, read, created_at, metadata)
      VALUES (${notification.userId}, ${notification.type}, ${notification.title}, ${notification.message}, ${notification.read}, ${notification.createdAt}, ${JSON.stringify(notification.metadata || {})})
      RETURNING *
    `

    // Send real-time notification
    await this.broadcastToUser(notification.userId, {
      type: "notification",
      data: result[0],
    })

    return result[0]
  }

  async getNotifications(userId: string, unreadOnly = false) {
    let query = sql`SELECT * FROM notifications WHERE user_id = ${userId}`

    if (unreadOnly) {
      query = sql`SELECT * FROM notifications WHERE user_id = ${userId} AND read = false`
    }

    return await query.sql`ORDER BY created_at DESC`
  }

  async markNotificationAsRead(notificationId: string) {
    return await sql`
      UPDATE notifications 
      SET read = true 
      WHERE id = ${notificationId}
      RETURNING *
    `
  }

  private async broadcastToStream(streamId: string, message: any) {
    // Implementation would use WebSocket or Server-Sent Events
    console.log(`Broadcasting to stream ${streamId}:`, message)
  }

  private async broadcastToUser(userId: string, message: any) {
    // Implementation would use WebSocket or Server-Sent Events
    console.log(`Broadcasting to user ${userId}:`, message)
  }

  async submitFeedback(userId: string, type: string, rating: number, comment: string) {
    return await sql`
      INSERT INTO feedback (user_id, type, rating, comment, created_at)
      VALUES (${userId}, ${type}, ${rating}, ${comment}, NOW())
      RETURNING *
    `
  }

  async getFeedbackAnalytics(timeRange = "30d") {
    return await sql`
      SELECT 
        type,
        AVG(rating) as average_rating,
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback
      FROM feedback 
      WHERE created_at >= NOW() - INTERVAL ${timeRange}
      GROUP BY type
    `
  }
}
