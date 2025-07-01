// Admin dashboard type definitions

export interface AdminUser {
  id: number
  user_id: number
  role: "admin" | "super_admin" | "moderator"
  permissions: string[]
  created_by?: number
  created_at: string
  updated_at: string
  user?: {
    name: string
    email: string
    avatar_url?: string
  }
}

export interface SystemMetric {
  id: number
  metric_name: string
  metric_value: number
  metric_unit?: string
  category: "performance" | "usage" | "revenue" | "users"
  recorded_at: string
}

export interface AdminActivityLog {
  id: number
  admin_id: number
  action: string
  target_type?: string
  target_id?: number
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  admin?: {
    name: string
    email: string
  }
}

export interface SystemAlert {
  id: number
  alert_type: "error" | "warning" | "info"
  title: string
  message: string
  severity: number
  is_resolved: boolean
  resolved_by?: number
  resolved_at?: string
  created_at: string
}

export interface FeatureFlag {
  id: number
  flag_name: string
  description?: string
  is_enabled: boolean
  rollout_percentage: number
  target_users: number[]
  created_by?: number
  created_at: string
  updated_at: string
}

export interface ModerationItem {
  id: number
  content_type: string
  content_id: number
  user_id: number
  reported_by?: number
  reason: string
  status: "pending" | "approved" | "rejected"
  moderator_id?: number
  moderator_notes?: string
  created_at: string
  updated_at: string
  user?: {
    name: string
    email: string
  }
  reporter?: {
    name: string
    email: string
  }
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalStreams: number
  concurrentStreams: number
  systemHealth: {
    cpu: number
    memory: number
    storage: number
  }
}
