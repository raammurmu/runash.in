"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useHighlights } from "@/hooks/use-ai-tools"
import { Frame, Play, Download, Share, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AutoHighlights() {
  const [streamId, setStreamId] = useState("")
  const [duration, setDuration] = useState("")

  const { highlights, generateHighlights, generating, error } = useHighlights()
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!streamId.trim() || !duration) {
      toast({
        title: "Missing Information",
        description: "Please provide stream ID and duration",
        variant: "destructive",
      })
      return
    }

    const result = await generateHighlights(streamId.trim(), Number.parseInt(duration))
    if (result.length > 0) {
      toast({
        title: "Highlights Generated!",
        description: `Created ${result.length} highlight clips`,
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEngagementColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50"
    if (score >= 6) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Frame className="h-5 w-5 text-orange-500" />
            Auto Highlights Generator
          </CardTitle>
          <CardDescription>Automatically detect and create highlight clips from your streams using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="streamId">Stream ID</Label>
              <Input
                id="streamId"
                placeholder="Enter stream ID or URL"
                value={streamId}
                onChange={(e) => setStreamId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Stream Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="3600"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full flex items-center gap-2">
            {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Frame className="h-4 w-4" />}
            {generating ? "Analyzing Stream..." : "Generate Highlights"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {highlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Generated Highlights
              <Badge variant="secondary" className="ml-auto">
                {highlights.length} clips
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highlights.map((highlight) => (
                <Card key={highlight.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={highlight.thumbnail_url || "/placeholder.svg"}
                        alt={highlight.title}
                        className="w-32 h-18 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{highlight.title}</h3>
                        <Badge variant="secondary" className={getEngagementColor(highlight.engagement_score)}>
                          {highlight.engagement_score}/10
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600">{highlight.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(highlight.timestamp)} -{" "}
                          {formatDuration(highlight.timestamp + highlight.duration)}
                        </span>
                        <span>Duration: {formatDuration(highlight.duration)}</span>
                        <span>Confidence: {Math.round(highlight.confidence * 100)}%</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {highlight.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
