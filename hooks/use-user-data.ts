"use client"

import { useState, useEffect } from "react"
import type { User, UserPreferences, UserNotifications, UserSecurity, UserSession } from "@/lib/database"

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/profile")
      if (!response.ok) throw new Error("Failed to fetch user")
      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update user")
      const updatedUser = await response.json()
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { user, loading, error, updateUser, refetch: fetchUser }
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/preferences")
      if (!response.ok) throw new Error("Failed to fetch preferences")
      const preferencesData = await response.json()
      setPreferences(preferencesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update preferences")
      const updatedPreferences = await response.json()
      setPreferences(updatedPreferences)
      return updatedPreferences
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { preferences, loading, error, updatePreferences, refetch: fetchPreferences }
}

export function useUserNotifications() {
  const [notifications, setNotifications] = useState<UserNotifications | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/notifications")
      if (!response.ok) throw new Error("Failed to fetch notifications")
      const notificationsData = await response.json()
      setNotifications(notificationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateNotifications = async (updates: Partial<UserNotifications>) => {
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update notifications")
      const updatedNotifications = await response.json()
      setNotifications(updatedNotifications)
      return updatedNotifications
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { notifications, loading, error, updateNotifications, refetch: fetchNotifications }
}

export function useUserSecurity() {
  const [security, setSecurity] = useState<UserSecurity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSecurity()
  }, [])

  const fetchSecurity = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/security")
      if (!response.ok) throw new Error("Failed to fetch security settings")
      const securityData = await response.json()
      setSecurity(securityData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateSecurity = async (updates: Partial<UserSecurity>) => {
    try {
      const response = await fetch("/api/user/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update security settings")
      const updatedSecurity = await response.json()
      setSecurity(updatedSecurity)
      return updatedSecurity
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { security, loading, error, updateSecurity, refetch: fetchSecurity }
}

export function useUserSessions() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/sessions")
      if (!response.ok) throw new Error("Failed to fetch sessions")
      const sessionsData = await response.json()
      setSessions(sessionsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/user/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to revoke session")
      await fetchSessions() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const revokeAllSessions = async () => {
    try {
      const response = await fetch("/api/user/sessions", {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to revoke sessions")
      await fetchSessions() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  return { sessions, loading, error, revokeSession, revokeAllSessions, refetch: fetchSessions }
}
