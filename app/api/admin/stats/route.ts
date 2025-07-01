import { NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { isAdmin } from "@/lib/admin-auth"

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get latest metrics
    const metrics = await sql`
      SELECT DISTINCT ON (metric_name) 
        metric_name, metric_value, metric_unit, category
      FROM system_metrics 
      ORDER BY metric_name, recorded_at DESC
    `

    // Convert metrics to object for easier access
    const metricsMap = metrics.reduce(
      (acc, metric) => {
        acc[metric.metric_name] = metric.metric_value
        return acc
      },
      {} as Record<string, number>,
    )

    // Get user counts
    const userStats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as new_users_24h,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users
      FROM users
    `

    // Get subscription stats
    const subscriptionStats = await sql`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        SUM(CASE WHEN status = 'active' THEN 
          CASE WHEN billing_cycle = 'yearly' THEN sp.price_yearly ELSE sp.price_monthly END 
        END) as mrr
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
    `

    // Get recent activity
    const recentActivity = await sql`
      SELECT COUNT(*) as active_sessions
      FROM user_sessions 
      WHERE last_active >= NOW() - INTERVAL '1 hour'
    `

    const stats = {
      totalUsers: userStats[0].total_users,
      newUsers24h: userStats[0].new_users_24h,
      verifiedUsers: userStats[0].verified_users,
      activeUsers: metricsMap.active_users_24h || 0,
      totalSubscriptions: subscriptionStats[0].total_subscriptions,
      activeSubscriptions: subscriptionStats[0].active_subscriptions,
      monthlyRevenue: subscriptionStats[0].mrr || 0,
      totalRevenue: metricsMap.total_revenue || 0,
      totalStreams: metricsMap.total_streams || 0,
      concurrentStreams: metricsMap.concurrent_streams || 0,
      activeSessions: recentActivity[0].active_sessions,
      systemHealth: {
        cpu: metricsMap.server_cpu_usage || 0,
        memory: metricsMap.server_memory_usage || 0,
        storage: metricsMap.storage_used || 0,
        apiResponseTime: metricsMap.api_response_time || 0,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
