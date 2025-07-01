"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "./use-debounce"
import type { SearchResponse, SearchOptions, SearchSuggestion, SearchAnalytics } from "@/lib/search-types"

export function useSearch(initialOptions: Partial<SearchOptions> = {}) {
  const [query, setQuery] = useState(initialOptions.query || "")
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<SearchOptions>({
    query: "",
    type: "semantic",
    limit: 20,
    offset: 0,
    ...initialOptions,
  })

  const debouncedQuery = useDebounce(query, 300)

  const search = useCallback(
    async (searchOptions?: Partial<SearchOptions>) => {
      const finalOptions = { ...options, ...searchOptions, query: searchOptions?.query || debouncedQuery }

      if (!finalOptions.query.trim()) {
        setResults(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          q: finalOptions.query,
          type: finalOptions.type || "semantic",
          limit: (finalOptions.limit || 20).toString(),
          offset: (finalOptions.offset || 0).toString(),
        })

        if (finalOptions.filters?.document_type) {
          params.set("document_types", finalOptions.filters.document_type.join(","))
        }

        if (finalOptions.filters?.tags) {
          params.set("tags", finalOptions.filters.tags.join(","))
        }

        if (finalOptions.filters?.is_public !== undefined) {
          params.set("is_public", finalOptions.filters.is_public.toString())
        }

        if (finalOptions.filters?.date_range) {
          params.set("date_start", finalOptions.filters.date_range.start)
          params.set("date_end", finalOptions.filters.date_range.end)
        }

        const response = await fetch(`/api/search?${params}`)

        if (!response.ok) {
          throw new Error("Search failed")
        }

        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
      } finally {
        setLoading(false)
      }
    },
    [options, debouncedQuery],
  )

  useEffect(() => {
    if (debouncedQuery) {
      search()
    }
  }, [debouncedQuery, search])

  const updateOptions = useCallback((newOptions: Partial<SearchOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }))
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setQuery("")
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    options,
    updateOptions,
    search,
    clearResults,
  }
}

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data = await response.json()
        setSuggestions(data.suggestions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch suggestions")
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  return { suggestions, loading, error }
}

export function useSearchAnalytics(days = 30) {
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/search/analytics?days=${days}`)

        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [days])

  return { analytics, loading, error }
}
