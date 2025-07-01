export interface SearchDocument {
  id: string
  index_id: string
  document_id: string
  content_type: string
  title: string
  content: string
  metadata: Record<string, any>
  tags: string[]
  created_at: string
  updated_at: string
}

export interface SearchResult {
  id: string
  query_id: string
  document_id: string
  rank: number
  score: number
  relevance_type: string
  clicked: boolean
  created_at: string
  document?: SearchDocument
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query_id: string
  response_time_ms: number
  suggestions?: string[]
  facets?: {
    content_types: Array<{ value: string; count: number }>
    tags: Array<{ value: string; count: number }>
  }
}

export interface SearchRequest {
  query: string
  type?: "semantic" | "keyword" | "hybrid"
  filters?: {
    content_type?: string[]
    tags?: string[]
    date_range?: {
      start: string
      end: string
    }
  }
  limit?: number
  offset?: number
}

export interface SearchSuggestion {
  text: string
  type: "query" | "content"
  score: number
}

export interface SearchFilters {
  contentType?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  searchType?: "semantic" | "keyword" | "hybrid"
  limit?: number
  offset?: number
}

// Simplified response format for the frontend
export interface SearchResponseSimple {
  results: Array<{
    id: string
    title: string
    content: string
    contentType: string
    relevanceScore: number
    metadata: Record<string, any>
    tags: string[]
    createdAt: Date
  }>
  total: number
  query: string
  searchType: string
  responseTime: number
  suggestions: string[]
}
