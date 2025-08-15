"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Crown, Users, Eye, DollarSign, Clock, Edit } from "lucide-react"
import { useSession } from "next-auth/react"
import type { User } from "@/lib/user-management"

interface UserProfileCardProps {
  onEditProfile?: () => void
  onOpenSettings?: () => void
}

export function UserProfileCard({ onEditProfile, onOpenSettings }: UserProfileCardProps) {
  const { data: session } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/users/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "pro":
        return "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-amber-500" />
      case "creator":
        return <Users className="h-4 w-4 text-blue-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 ring-2 ring-orange-200 dark:ring-orange-800">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-lg font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold">{user.name}</h3>
                {getRoleIcon(user.role)}
              </div>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getSubscriptionColor(user.subscription_tier)}>
                  {user.subscription_tier.toUpperCase()}
                </Badge>
                {user.email_verified && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onOpenSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Users className="h-6 w-6 mx-auto text-blue-500 mb-1" />
            <div className="text-lg font-bold">{user.stats.followers_count.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Eye className="h-6 w-6 mx-auto text-green-500 mb-1" />
            <div className="text-lg font-bold">{user.stats.average_viewers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Avg Viewers</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto text-orange-500 mb-1" />
            <div className="text-lg font-bold">{Math.floor(user.stats.total_watch_time / 60)}h</div>
            <div className="text-xs text-muted-foreground">Watch Time</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <DollarSign className="h-6 w-6 mx-auto text-purple-500 mb-1" />
            <div className="text-lg font-bold">${user.stats.total_revenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
