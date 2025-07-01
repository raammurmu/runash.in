"use client"

import { useState, useCallback } from "react"
import type { SearchOptions, SearchResponseSimple, SearchSuggestion } from "@/lib/search-types"

interface UseSearchReturn {
  search: (options: SearchOptions) => Promise<void>
  isLoading: boolean
  results: SearchResponseSimple | null
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponseSimple | null>(null)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (options: SearchOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { search, isLoading, results, error }
}

interface UseSearchSuggestionsReturn {
  suggestions: SearchSuggestion[]
  getSuggestions: (query: string) => Promise<void>
  clearSuggestions: () => void
  isLoading: boolean
}

export function useSearchSuggestions(): UseSearchSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return { suggestions, getSuggestions, clearSuggestions, isLoading }
}

interface UseSearchAnalyticsReturn {
  analytics: any
  fetchAnalytics: () => Promise<void>
  isLoading: boolean
}

export function useSearchAnalytics(): UseSearchAnalyticsReturn {
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/search/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { analytics, fetchAnalytics, isLoading }
}
