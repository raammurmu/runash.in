export interface SearchIndex {
  id: number
  name: string
  description?: string
  index_type: "semantic" | "keyword" | "hybrid"
  model_name: string
  dimensions: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SearchDocument {
  id: string
  index_id: number
  document_type: "user" | "file" | "stream" | "content"
  document_id: string
  title: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
  keywords: string[]
  tags: string[]
  user_id?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface SearchQuery {
  id: string
  user_id?: string
  query_text: string
  query_type: "semantic" | "keyword" | "hybrid"
  filters: Record<string, any>
  results_count: number
  response_time_ms?: number
  created_at: string
}

export interface SearchResult {
  id: string
  query_id: string
  document_id: string
  document: SearchDocument
  relevance_score: number
  rank_position: number
  created_at: string
}

export interface SearchOptions {
  query: string
  type?: "semantic" | "keyword" | "hybrid"
  filters?: {
    document_type?: string[]
    tags?: string[]
    user_id?: string
    is_public?: boolean
    date_range?: {
      start: string
      end: string
    }
  }
  limit?: number
  offset?: number
  include_metadata?: boolean
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query_id: string
  response_time_ms: number
  suggestions?: string[]
  facets?: Record<string, Array<{ value: string; count: number }>>
}

export interface SearchSuggestion {
  text: string
  type: "query" | "filter" | "tag"
  score: number
}

export interface SearchAnalytics {
  total_queries: number
  avg_response_time: number
  popular_queries: Array<{ query: string; count: number }>
  search_trends: Array<{ date: string; queries: number }>
  top_results: Array<{ document_id: string; title: string; clicks: number }>
}
