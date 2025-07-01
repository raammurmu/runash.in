"use client"

import { useState, useEffect } from "react"
import type { DashboardStats, SystemAlert, FeatureFlag } from "@/lib/admin-types"

export function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}

export function useAdminAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/alerts")
      if (!response.ok) throw new Error("Failed to fetch alerts")
      const data = await response.json()
      setAlerts(data.alerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: number) => {
    const response = await fetch("/api/admin/alerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId, action: "resolve" }),
    })
    if (!response.ok) throw new Error("Failed to resolve alert")
    await fetchAlerts()
  }

  return { alerts, loading, error, resolveAlert, refetch: fetchAlerts }
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/feature-flags")
      if (!response.ok) throw new Error("Failed to fetch feature flags")
      const data = await response.json()
      setFlags(data.flags)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateFlag = async (flagId: number, isEnabled: boolean, rolloutPercentage?: number) => {
    const response = await fetch("/api/admin/feature-flags", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagId, isEnabled, rolloutPercentage }),
    })
    if (!response.ok) throw new Error("Failed to update feature flag")
    await fetchFlags()
  }

  return { flags, loading, error, updateFlag, refetch: fetchFlags }
}
