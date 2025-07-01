"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useContentGeneration } from "@/hooks/use-ai-tools"
import type { ContentGenerationRequest } from "@/lib/ai-types"
import { Zap, Copy, RefreshCw, Sparkles, FileText, Hash, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContentGenerator() {
  const [context, setContext] = useState("")
  const [tone, setTone] = useState<"professional" | "casual" | "energetic" | "educational">("professional")
  const [length, setLength] = useState<"short" | "medium" | "long">("medium")
  const [keywords, setKeywords] = useState("")
  const [results, setResults] = useState<any>(null)

  const { generateContent, generating, error } = useContentGeneration()
  const { toast } = useToast()

  const handleGenerate = async (type: ContentGenerationRequest["type"]) => {
    if (!context.trim()) {
      toast({
        title: "Context Required",
        description: "Please provide context for content generation",
        variant: "destructive",
      })
      return
    }

    const request: ContentGenerationRequest = {
      type,
      context: context.trim(),
      tone,
      length,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    }

    const result = await generateContent(request)
    if (result) {
      setResults(result)
      toast({
        title: "Content Generated!",
        description: `Successfully generated ${type} content`,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            AI Content Generator
          </CardTitle>
          <CardDescription>Generate compelling titles, descriptions, and scripts for your streams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="context">Stream Context</Label>
              <Textarea
                id="context"
                placeholder="Describe your stream content, topic, or theme..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="energetic">Energetic</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Length</Label>
                <Select value={length} onValueChange={(value: any) => setLength(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (optional)</Label>
                <Input
                  id="keywords"
                  placeholder="gaming, tutorial, live"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={() => handleGenerate("title")} disabled={generating} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Title
            </Button>
            <Button
              onClick={() => handleGenerate("description")}
              disabled={generating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Description
            </Button>
            <Button
              onClick={() => handleGenerate("tags")}
              disabled={generating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Hash className="h-4 w-4" />
              Tags
            </Button>
            <Button
              onClick={() => handleGenerate("script")}
              disabled={generating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Script
            </Button>
          </div>

          {generating && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
              <span className="ml-2">Generating content...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Generated Content
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round(results.confidence * 100)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1">{results.content}</p>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {results.alternatives && results.alternatives.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Alternative Options:</Label>
                    <div className="space-y-2 mt-2">
                      {results.alternatives.map((alt: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <p className="flex-1 text-sm">{alt}</p>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(alt)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Tokens used: {results.usage_tokens}</span>
                  <span>•</span>
                  <span>Generated at: {new Date(results.created_at).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
