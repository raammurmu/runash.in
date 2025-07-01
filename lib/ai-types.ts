export interface AITool {
  id: string
  name: string
  description: string
  category: "content" | "moderation" | "analytics" | "automation"
  icon: string
  status: "active" | "inactive" | "processing"
  usage: {
    daily: number
    monthly: number
    limit: number
  }
  settings: Record<string, any>
}

export interface ContentGenerationRequest {
  type: "title" | "description" | "tags" | "thumbnail" | "script"
  context: string
  tone: "professional" | "casual" | "energetic" | "educational"
  length: "short" | "medium" | "long"
  keywords?: string[]
}

export interface ContentGenerationResponse {
  id: string
  type: string
  content: string
  alternatives: string[]
  confidence: number
  usage_tokens: number
  created_at: string
}

export interface AutoHighlight {
  id: string
  stream_id: string
  timestamp: number
  duration: number
  title: string
  description: string
  confidence: number
  thumbnail_url: string
  clip_url: string
  tags: string[]
  engagement_score: number
  created_at: string
}

export interface ChatModerationRule {
  id: string
  name: string
  type: "spam" | "toxicity" | "profanity" | "caps" | "links" | "custom"
  action: "warn" | "timeout" | "ban" | "delete"
  severity: "low" | "medium" | "high"
  enabled: boolean
  settings: {
    threshold?: number
    duration?: number
    whitelist?: string[]
    blacklist?: string[]
    custom_pattern?: string
  }
}

export interface ChatModerationEvent {
  id: string
  stream_id: string
  user_id: string
  username: string
  message: string
  rule_triggered: string
  action_taken: string
  confidence: number
  timestamp: string
}

export interface AIAnalytics {
  content_generated: number
  highlights_created: number
  messages_moderated: number
  tokens_used: number
  cost_saved: number
  engagement_improved: number
}
