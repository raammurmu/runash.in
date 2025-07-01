"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Eye, Clock, MoreHorizontal, ExternalLink, Settings, Square } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LiveStream {
  id: string
  title: string
  streamer: {
    name: string
    avatar: string
    username: string
  }
  viewers: number
  duration: string
  category: string
  thumbnail: string
  status: "live" | "scheduled" | "ended"
}

export function LiveStreamsWidget() {
  const liveStreams: LiveStream[] = [
    {
      id: "1",
      title: "Building a React Dashboard with AI Features",
      streamer: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "alexdev",
      },
      viewers: 1247,
      duration: "2h 15m",
      category: "Programming",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "live",
    },
    {
      id: "2",
      title: "Music Production Masterclass - Creating Beats",
      streamer: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "sarahbeats",
      },
      viewers: 892,
      duration: "1h 45m",
      category: "Music",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "live",
    },
    {
      id: "3",
      title: "Competitive Gaming Tournament - Finals",
      streamer: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "mikegamer",
      },
      viewers: 3421,
      duration: "3h 22m",
      category: "Gaming",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "live",
    },
    {
      id: "4",
      title: "Digital Art Workshop - Character Design",
      streamer: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        username: "emmaart",
      },
      viewers: 567,
      duration: "45m",
      category: "Art",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "live",
    },
  ]

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Live Streams</CardTitle>
          <CardDescription>Currently active streams on your platform</CardDescription>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
          {liveStreams.length} Live
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveStreams.map((stream) => (
          <div
            key={stream.id}
            className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="relative">
              <img
                src={stream.thumbnail || "/placeholder.svg"}
                alt={stream.title}
                className="w-16 h-10 rounded object-cover"
              />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-red-500 text-white border-0"
              >
                LIVE
              </Badge>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{stream.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={stream.streamer.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{stream.streamer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{stream.streamer.name}</span>
                <Badge variant="outline" className="text-xs">
                  {stream.category}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViewers(stream.viewers)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{stream.duration}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Stream
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Stream Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Square className="mr-2 h-4 w-4" />
                  End Stream
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        <div className="pt-2">
          <Button variant="outline" className="w-full bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Start New Stream
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
