import { sql } from "@/lib/database"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type {
  SearchDocument,
  SearchOptions,
  SearchResponse,
  SearchResult,
  SearchSuggestion,
  SearchAnalytics,
} from "./search-types"

export class AISearchService {
  private static instance: AISearchService

  static getInstance(): AISearchService {
    if (!AISearchService.instance) {
      AISearchService.instance = new AISearchService()
    }
    return AISearchService.instance
  }

  async search(options: SearchOptions, userId?: string): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      // Create search query record
      const queryRecord = await sql`
        INSERT INTO search_queries (user_id, query_text, query_type, filters)
        VALUES (${userId || null}, ${options.query}, ${options.type || "semantic"}, ${JSON.stringify(options.filters || {})})
        RETURNING id
      `
      const queryId = queryRecord[0].id

      let results: SearchResult[] = []

      switch (options.type || "semantic") {
        case "semantic":
          results = await this.semanticSearch(options, queryId)
          break
        case "keyword":
          results = await this.keywordSearch(options, queryId)
          break
        case "hybrid":
          results = await this.hybridSearch(options, queryId)
          break
      }

      const responseTime = Date.now() - startTime

      // Update query with results count and response time
      await sql`
        UPDATE search_queries 
        SET results_count = ${results.length}, response_time_ms = ${responseTime}
        WHERE id = ${queryId}
      `

      // Generate suggestions
      const suggestions = await this.generateSuggestions(options.query, results)

      // Generate facets
      const facets = await this.generateFacets(results)

      return {
        results,
        total: results.length,
        query_id: queryId,
        response_time_ms: responseTime,
        suggestions,
        facets,
      }
    } catch (error) {
      console.error("Search error:", error)
      throw new Error("Search failed")
    }
  }

  private async semanticSearch(options: SearchOptions, queryId: string): Promise<SearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(options.query)

      // Build WHERE clause for filters
      const whereConditions = this.buildWhereConditions(options.filters)

      // Perform semantic search using cosine similarity
      // Note: This is a simplified version. In production, you'd use pgvector
      const documents = await sql`
        SELECT 
          sd.*,
          -- Simulate semantic similarity score
          CASE 
            WHEN sd.keywords && ${this.extractKeywords(options.query)} THEN 0.8
            WHEN sd.content ILIKE ${"%" + options.query + "%"} THEN 0.6
            WHEN sd.title ILIKE ${"%" + options.query + "%"} THEN 0.9
            ELSE 0.3
          END as relevance_score
        FROM search_documents sd
        WHERE ${whereConditions.length > 0 ? sql.join(whereConditions, sql` AND `) : sql`1=1`}
        ORDER BY relevance_score DESC
        LIMIT ${options.limit || 20}
        OFFSET ${options.offset || 0}
      `

      // Create search results
      const results: SearchResult[] = []
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        // Insert search result record
        const resultRecord = await sql`
          INSERT INTO search_results (query_id, document_id, relevance_score, rank_position)
          VALUES (${queryId}, ${doc.id}, ${doc.relevance_score}, ${i + 1})
          RETURNING id
        `

        results.push({
          id: resultRecord[0].id,
          query_id: queryId,
          document_id: doc.id,
          document: doc,
          relevance_score: doc.relevance_score,
          rank_position: i + 1,
          created_at: new Date().toISOString(),
        })
      }

      return results
    } catch (error) {
      console.error("Semantic search error:", error)
      return []
    }
  }

  private async keywordSearch(options: SearchOptions, queryId: string): Promise<SearchResult[]> {
    try {
      const keywords = this.extractKeywords(options.query)
      const whereConditions = this.buildWhereConditions(options.filters)

      const documents = await sql`
        SELECT 
          sd.*,
          -- Calculate keyword relevance score
          CASE 
            WHEN sd.title ILIKE ${"%" + options.query + "%"} THEN 1.0
            WHEN sd.keywords && ${keywords} THEN 0.8
            WHEN sd.content ILIKE ${"%" + options.query + "%"} THEN 0.6
            ELSE 0.2
          END as relevance_score
        FROM search_documents sd
        WHERE (
          sd.title ILIKE ${"%" + options.query + "%"} OR
          sd.content ILIKE ${"%" + options.query + "%"} OR
          sd.keywords && ${keywords}
        )
        ${whereConditions.length > 0 ? sql`AND ${sql.join(whereConditions, sql` AND `)}` : sql``}
        ORDER BY relevance_score DESC
        LIMIT ${options.limit || 20}
        OFFSET ${options.offset || 0}
      `

      const results: SearchResult[] = []
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i]

        const resultRecord = await sql`
          INSERT INTO search_results (query_id, document_id, relevance_score, rank_position)
          VALUES (${queryId}, ${doc.id}, ${doc.relevance_score}, ${i + 1})
          RETURNING id
        `

        results.push({
          id: resultRecord[0].id,
          query_id: queryId,
          document_id: doc.id,
          document: doc,
          relevance_score: doc.relevance_score,
          rank_position: i + 1,
          created_at: new Date().toISOString(),
        })
      }

      return results
    } catch (error) {
      console.error("Keyword search error:", error)
      return []
    }
  }

  private async hybridSearch(options: SearchOptions, queryId: string): Promise<SearchResult[]> {
    try {
      // Combine semantic and keyword search results
      const semanticResults = await this.semanticSearch(options, queryId)
      const keywordResults = await this.keywordSearch(options, queryId)

      // Merge and re-rank results
      const combinedResults = new Map<string, SearchResult>()

      // Add semantic results with weight
      semanticResults.forEach((result) => {
        combinedResults.set(result.document_id, {
          ...result,
          relevance_score: result.relevance_score * 0.7, // 70% weight for semantic
        })
      })

      // Add keyword results with weight, combining scores if document already exists
      keywordResults.forEach((result) => {
        const existing = combinedResults.get(result.document_id)
        if (existing) {
          existing.relevance_score += result.relevance_score * 0.3 // 30% weight for keyword
        } else {
          combinedResults.set(result.document_id, {
            ...result,
            relevance_score: result.relevance_score * 0.3,
          })
        }
      })

      // Sort by combined relevance score and re-rank
      const finalResults = Array.from(combinedResults.values())
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, options.limit || 20)
        .map((result, index) => ({
          ...result,
          rank_position: index + 1,
        }))

      return finalResults
    } catch (error) {
      console.error("Hybrid search error:", error)
      return []
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // In a real implementation, you would call OpenAI's embedding API
      // For now, we'll return a mock embedding
      return new Array(1536).fill(0).map(() => Math.random())
    } catch (error) {
      console.error("Embedding generation error:", error)
      return []
    }
  }

  private extractKeywords(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .filter((word) => !["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"].includes(word))
  }

  private buildWhereConditions(filters?: SearchOptions["filters"]) {
    const conditions = []

    if (!filters) return conditions

    if (filters.document_type && filters.document_type.length > 0) {
      conditions.push(sql`sd.document_type = ANY(${filters.document_type})`)
    }

    if (filters.tags && filters.tags.length > 0) {
      conditions.push(sql`sd.tags && ${filters.tags}`)
    }

    if (filters.user_id) {
      conditions.push(sql`sd.user_id = ${filters.user_id}`)
    }

    if (filters.is_public !== undefined) {
      conditions.push(sql`sd.is_public = ${filters.is_public}`)
    }

    if (filters.date_range) {
      conditions.push(sql`sd.created_at BETWEEN ${filters.date_range.start} AND ${filters.date_range.end}`)
    }

    return conditions
  }

  private async generateSuggestions(query: string, results: SearchResult[]): Promise<string[]> {
    try {
      // Extract common terms from top results
      const topResults = results.slice(0, 5)
      const allKeywords = topResults.flatMap((r) => r.document.keywords)
      const keywordCounts = allKeywords.reduce(
        (acc, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Get most common keywords as suggestions
      const suggestions = Object.entries(keywordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([keyword]) => keyword)
        .filter((keyword) => !query.toLowerCase().includes(keyword.toLowerCase()))

      return suggestions
    } catch (error) {
      console.error("Suggestion generation error:", error)
      return []
    }
  }

  private async generateFacets(
    results: SearchResult[],
  ): Promise<Record<string, Array<{ value: string; count: number }>>> {
    try {
      const facets: Record<string, Record<string, number>> = {
        document_type: {},
        tags: {},
      }

      results.forEach((result) => {
        // Document type facet
        const docType = result.document.document_type
        facets.document_type[docType] = (facets.document_type[docType] || 0) + 1

        // Tags facet
        result.document.tags.forEach((tag) => {
          facets.tags[tag] = (facets.tags[tag] || 0) + 1
        })
      })

      // Convert to required format
      const formattedFacets: Record<string, Array<{ value: string; count: number }>> = {}

      Object.entries(facets).forEach(([facetName, facetData]) => {
        formattedFacets[facetName] = Object.entries(facetData)
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      })

      return formattedFacets
    } catch (error) {
      console.error("Facet generation error:", error)
      return {}
    }
  }

  async indexDocument(document: Omit<SearchDocument, "id" | "created_at" | "updated_at">): Promise<string | null> {
    try {
      // Generate embedding for the document content
      const embedding = await this.generateEmbedding(`${document.title} ${document.content}`)

      const result = await sql`
        INSERT INTO search_documents ${sql({
          ...document,
          embedding: JSON.stringify(embedding),
        })}
        RETURNING id
      `

      return result[0].id
    } catch (error) {
      console.error("Document indexing error:", error)
      return null
    }
  }

  async updateDocument(documentId: string, updates: Partial<SearchDocument>): Promise<boolean> {
    try {
      // If content or title changed, regenerate embedding
      if (updates.title || updates.content) {
        const current = await sql`SELECT title, content FROM search_documents WHERE id = ${documentId}`
        if (current.length > 0) {
          const title = updates.title || current[0].title
          const content = updates.content || current[0].content
          updates.embedding = JSON.stringify(await this.generateEmbedding(`${title} ${content}`))
        }
      }

      await sql`
        UPDATE search_documents 
        SET ${sql(updates)}, updated_at = NOW()
        WHERE id = ${documentId}
      `

      return true
    } catch (error) {
      console.error("Document update error:", error)
      return false
    }
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      await sql`DELETE FROM search_documents WHERE id = ${documentId}`
      return true
    } catch (error) {
      console.error("Document deletion error:", error)
      return false
    }
  }

  async getSearchAnalytics(userId?: string, days = 30): Promise<SearchAnalytics> {
    try {
      const userFilter = userId ? sql`WHERE user_id = ${userId}` : sql``
      const dateFilter = sql`created_at >= NOW() - INTERVAL '${days} days'`
      const combinedFilter = userId ? sql`WHERE user_id = ${userId} AND ${dateFilter}` : sql`WHERE ${dateFilter}`

      // Total queries
      const totalQueries = await sql`
        SELECT COUNT(*) as count 
        FROM search_queries 
        ${combinedFilter}
      `

      // Average response time
      const avgResponseTime = await sql`
        SELECT AVG(response_time_ms) as avg_time 
        FROM search_queries 
        ${combinedFilter}
        AND response_time_ms IS NOT NULL
      `

      // Popular queries
      const popularQueries = await sql`
        SELECT query_text, COUNT(*) as count
        FROM search_queries 
        ${combinedFilter}
        GROUP BY query_text
        ORDER BY count DESC
        LIMIT 10
      `

      // Search trends
      const searchTrends = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as queries
        FROM search_queries 
        ${combinedFilter}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT ${days}
      `

      // Top results (most clicked)
      const topResults = await sql`
        SELECT 
          sd.document_id,
          sd.title,
          COUNT(sr.id) as clicks
        FROM search_results sr
        JOIN search_documents sd ON sr.document_id = sd.id
        JOIN search_queries sq ON sr.query_id = sq.id
        WHERE sq.created_at >= NOW() - INTERVAL '${days} days'
        ${userId ? sql`AND sq.user_id = ${userId}` : sql``}
        GROUP BY sd.document_id, sd.title
        ORDER BY clicks DESC
        LIMIT 10
      `

      return {
        total_queries: Number.parseInt(totalQueries[0].count),
        avg_response_time: Number.parseFloat(avgResponseTime[0].avg_time || "0"),
        popular_queries: popularQueries.map((q) => ({
          query: q.query_text,
          count: Number.parseInt(q.count),
        })),
        search_trends: searchTrends.map((t) => ({
          date: t.date,
          queries: Number.parseInt(t.queries),
        })),
        top_results: topResults.map((r) => ({
          document_id: r.document_id,
          title: r.title,
          clicks: Number.parseInt(r.clicks),
        })),
      }
    } catch (error) {
      console.error("Analytics error:", error)
      return {
        total_queries: 0,
        avg_response_time: 0,
        popular_queries: [],
        search_trends: [],
        top_results: [],
      }
    }
  }

  async getSmartSuggestions(query: string, userId?: string): Promise<SearchSuggestion[]> {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Given the search query "${query}", suggest 5 related search terms that would be helpful for a streaming platform user. Return only the suggestions, one per line, without numbering or formatting.`,
      })

      const suggestions = text
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 5)
        .map((suggestion, index) => ({
          text: suggestion.trim(),
          type: "query" as const,
          score: 1 - index * 0.1,
        }))

      return suggestions
    } catch (error) {
      console.error("Smart suggestions error:", error)
      return []
    }
  }
}

export const aiSearchService = AISearchService.getInstance()
