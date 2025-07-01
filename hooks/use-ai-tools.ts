"use client"

import { useState, useEffect } from "react"
import type {
  AITool,
  ContentGenerationRequest,
  ContentGenerationResponse,
  AutoHighlight,
  ChatModerationRule,
} from "@/lib/ai-types"

export function useAITools() {
  const [tools, setTools] = useState<AITool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      setLoading(true)
      // Simulate API call - in real app, this would fetch from /api/ai/tools
      const mockTools: AITool[] = [
        {
          id: "content-generator",
          name: "Content Generator",
          description: "AI-powered content creation for titles, descriptions, and scripts",
          category: "content",
          icon: "Zap",
          status: "active",
          usage: { daily: 15, monthly: 342, limit: 500 },
          settings: { tone: "professional", length: "medium" },
        },
        {
          id: "auto-highlights",
          name: "Auto Highlights",
          description: "Automatically detect and create highlight clips from streams",
          category: "automation",
          icon: "Frame",
          status: "active",
          usage: { daily: 3, monthly: 28, limit: 100 },
          settings: { confidence: 0.8, minDuration: 15 },
        },
        {
          id: "chat-moderation",
          name: "Chat Moderation",
          description: "AI-powered chat moderation and spam detection",
          category: "moderation",
          icon: "Shield",
          status: "active",
          usage: { daily: 156, monthly: 4230, limit: 10000 },
          settings: { toxicity: 0.7, autoAction: true },
        },
      ]
      setTools(mockTools)
    } catch (err) {
      setError("Failed to fetch AI tools")
    } finally {
      setLoading(false)
    }
  }

  return { tools, loading, error, refetch: fetchTools }
}

export function useContentGeneration() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateContent = async (request: ContentGenerationRequest): Promise<ContentGenerationResponse | null> => {
    try {
      setGenerating(true)
      setError(null)

      const response = await fetch("/api/ai/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const result = await response.json()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content")
      return null
    } finally {
      setGenerating(false)
    }
  }

  return { generateContent, generating, error }
}

export function useHighlights() {
  const [highlights, setHighlights] = useState<AutoHighlight[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateHighlights = async (streamId: string, duration: number) => {
    try {
      setGenerating(true)
      setError(null)

      const response = await fetch("/api/ai/highlights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId, duration }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate highlights")
      }

      const result = await response.json()
      setHighlights(result.highlights)
      return result.highlights
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate highlights")
      return []
    } finally {
      setGenerating(false)
    }
  }

  return { highlights, generateHighlights, generating, error }
}

export function useModerationRules() {
  const [rules, setRules] = useState<ChatModerationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ai/moderation/rules")

      if (!response.ok) {
        throw new Error("Failed to fetch moderation rules")
      }

      const data = await response.json()
      setRules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rules")
    } finally {
      setLoading(false)
    }
  }

  const createRule = async (rule: Omit<ChatModerationRule, "id">) => {
    try {
      const response = await fetch("/api/ai/moderation/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      })

      if (!response.ok) {
        throw new Error("Failed to create rule")
      }

      const newRule = await response.json()
      setRules((prev) => [newRule, ...prev])
      return newRule
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rule")
      return null
    }
  }

  return { rules, loading, error, createRule, refetch: fetchRules }
}
