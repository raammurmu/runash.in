"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, DollarSign, MessageSquare, Share2, Upload, Settings, Shield, Bell, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "stream" | "follow" | "donation" | "comment" | "share" | "upload" | "setting" | "security"
  title: string
  description: string
  user?: {
    name: string
    avatar: string
    username: string
  }
  timestamp: string
  metadata?: {
    amount?: number
    viewers?: number
    duration?: string
  }
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "stream",
      title: "Stream Started",
      description: "React Dashboard Tutorial went live",
      timestamp: "2 minutes ago",
      metadata: { viewers: 1247 },
    },
    {
      id: "2",
      type: "follow",
      title: "New Follower",
      description: "followed your channel",
      user: {
        name: "Jessica Park",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "jessicap",
      },
      timestamp: "5 minutes ago",
    },
    {
      id: "3",
      type: "donation",
      title: "Donation Received",
      description: "sent a donation with message: 'Great tutorial!'",
      user: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "davidk",
      },
      timestamp: "12 minutes ago",
      metadata: { amount: 25 },
    },
    {
      id: "4",
      type: "comment",
      title: "New Comment",
      description: "commented on your latest stream",
      user: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "mariag",
      },
      timestamp: "18 minutes ago",
    },
    {
      id: "5",
      type: "upload",
      title: "File Uploaded",
      description: "Stream recording processed successfully",
      timestamp: "25 minutes ago",
      metadata: { duration: "2h 15m" },
    },
    {
      id: "6",
      type: "share",
      title: "Stream Shared",
      description: "shared your stream on social media",
      user: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "alext",
      },
      timestamp: "32 minutes ago",
    },
    {
      id: "7",
      type: "security",
      title: "Security Alert",
      description: "New login from Chrome on Windows",
      timestamp: "1 hour ago",
    },
    {
      id: "8",
      type: "setting",
      title: "Settings Updated",
      description: "Stream quality settings changed to 1080p",
      timestamp: "2 hours ago",
    },
  ]

  const getActivityIcon = (type: Activity["type"]) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "stream":
        return <Video className={cn(iconClass, "text-red-500")} />
      case "follow":
        return <Users className={cn(iconClass, "text-blue-500")} />
      case "donation":
        return <DollarSign className={cn(iconClass, "text-green-500")} />
      case "comment":
        return <MessageSquare className={cn(iconClass, "text-purple-500")} />
      case "share":
        return <Share2 className={cn(iconClass, "text-orange-500")} />
      case "upload":
        return <Upload className={cn(iconClass, "text-indigo-500")} />
      case "setting":
        return <Settings className={cn(iconClass, "text-gray-500")} />
      case "security":
        return <Shield className={cn(iconClass, "text-yellow-500")} />
      default:
        return <Bell className={cn(iconClass, "text-gray-500")} />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "stream":
        return "bg-red-50 border-red-200"
      case "follow":
        return "bg-blue-50 border-blue-200"
      case "donation":
        return "bg-green-50 border-green-200"
      case "comment":
        return "bg-purple-50 border-purple-200"
      case "share":
        return "bg-orange-50 border-orange-200"
      case "upload":
        return "bg-indigo-50 border-indigo-200"
      case "setting":
        return "bg-gray-50 border-gray-200"
      case "security":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Latest updates and interactions on your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg border transition-colors hover:bg-accent/50",
                getActivityColor(activity.type),
              )}
            >
              <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  {activity.metadata?.amount && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      ${activity.metadata.amount}
                    </Badge>
                  )}
                  {activity.metadata?.viewers && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                      {activity.metadata.viewers} viewers
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-1">
                  {activity.user && (
                    <>
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-muted-foreground">{activity.user.name}</span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">{activity.description}</span>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {activity.timestamp}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
