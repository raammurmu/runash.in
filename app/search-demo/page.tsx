"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchBar } from "@/components/search-bar"
import { useSearch } from "@/hooks/use-search"
import { Search, Users, Video, File, FileText, Clock, TrendingUp, Zap } from "lucide-react"

const demoQueries = [
  {
    category: "AI & Technology",
    queries: [
      { text: "AI tutorial", description: "Find AI development tutorials and guides" },
      { text: "machine learning", description: "Search for ML content and resources" },
      { text: "python tensorflow", description: "Specific tech stack searches" },
    ],
  },
  {
    category: "Gaming & Entertainment",
    queries: [
      { text: "gaming highlights", description: "Find gaming clips and compilations" },
      { text: "esports championship", description: "Tournament and competitive content" },
      { text: "streaming guide", description: "How-to guides for streamers" },
    ],
  },
  {
    category: "Music & Audio",
    queries: [
      { text: "music production", description: "Production tutorials and techniques" },
      { text: "beat pack", description: "Audio files and music resources" },
      { text: "masterclass", description: "Educational music content" },
    ],
  },
  {
    category: "Content Creation",
    queries: [
      { text: "content creation", description: "General content creation tips" },
      { text: "community building", description: "Audience engagement strategies" },
      { text: "live streaming", description: "Streaming setup and best practices" },
    ],
  },
]

const searchTypes = [
  {
    type: "hybrid",
    name: "Smart Search",
    description: "Combines AI understanding with keyword matching",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    type: "semantic",
    name: "AI Search",
    description: "Uses AI to understand context and meaning",
    icon: Search,
    color: "bg-purple-500",
  },
  {
    type: "keyword",
    name: "Exact Match",
    description: "Traditional keyword-based search",
    icon: FileText,
    color: "bg-green-500",
  },
]

const contentTypes = [
  { type: "user", name: "Users", icon: Users, count: 3 },
  { type: "stream", name: "Streams", icon: Video, count: 3 },
  { type: "file", name: "Files", icon: File, count: 3 },
  { type: "content", name: "Content", icon: FileText, count: 3 },
]

export default function SearchDemoPage() {
  const [activeDemo, setActiveDemo] = useState<string>("")
  const [selectedSearchType, setSelectedSearchType] = useState<"hybrid" | "semantic" | "keyword">("hybrid")
  const { search, isLoading, results, error } = useSearch()

  const handleDemoSearch = async (query: string, searchType: "hybrid" | "semantic" | "keyword" = "hybrid") => {
    setActiveDemo(query)
    setSelectedSearchType(searchType)

    await search({
      query,
      searchType,
      filters: {},
      limit: 10,
    })
  }

  const handleCustomSearch = async (query: string, filters: any) => {
    setActiveDemo(query)
    await search({
      query,
      searchType: selectedSearchType,
      filters,
      limit: 20,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">AI Search Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the power of intelligent search across users, streams, files, and content
        </p>
      </div>

      {/* Search Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Methods
          </CardTitle>
          <CardDescription>Choose how you want to search through our content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {searchTypes.map((type) => {
              const Icon = type.icon
              return (
                <Card
                  key={type.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSearchType === type.type ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSearchType(type.type as any)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold">{type.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Search */}
      <Card>
        <CardHeader>
          <CardTitle>Try It Yourself</CardTitle>
          <CardDescription>Search across all content types with your own queries</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar
            onSearch={handleCustomSearch}
            placeholder={`Search with ${searchTypes.find((t) => t.type === selectedSearchType)?.name}...`}
          />
        </CardContent>
      </Card>

      {/* Demo Queries */}
      <Tabs defaultValue="AI & Technology" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {demoQueries.map((category) => (
            <TabsTrigger key={category.category} value={category.category}>
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {demoQueries.map((category) => (
          <TabsContent key={category.category} value={category.category}>
            <Card>
              <CardHeader>
                <CardTitle>{category.category} Searches</CardTitle>
                <CardDescription>Click any query to see search results in action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.queries.map((query) => (
                    <Card
                      key={query.text}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        activeDemo === query.text ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleDemoSearch(query.text, selectedSearchType)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {query.text}
                            </Badge>
                            {isLoading && activeDemo === query.text && (
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{query.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Available Content
          </CardTitle>
          <CardDescription>Overview of searchable content in the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.type} className="text-center p-4 rounded-lg border">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-2xl font-bold text-primary">{type.count}</p>
                  <p className="text-xs text-muted-foreground">items</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {results.responseTime}ms
              </div>
            </CardTitle>
            <CardDescription>
              Found {results.total} results for "{results.query}" using {results.searchType} search
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.results.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">Try a different search term or method</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.results.map((result) => {
                  const Icon = contentTypes.find((t) => t.type === result.contentType)?.icon || FileText
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline" className="text-xs">
                                {contentTypes.find((t) => t.type === result.contentType)?.name || result.contentType}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Relevance</div>
                              <div className="text-sm font-medium">{Math.round(result.relevanceScore * 100)}%</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                            <p className="text-muted-foreground text-sm">
                              {result.content.length > 150 ? result.content.substring(0, 150) + "..." : result.content}
                            </p>
                          </div>

                          {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 4).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {result.tags.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{result.tags.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm" className="text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button variant="outline" onClick={() => activeDemo && handleDemoSearch(activeDemo, selectedSearchType)}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
          <CardDescription>Get the most out of your search experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Smart Search Tips:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use natural language queries</li>
                <li>• Try related terms and synonyms</li>
                <li>• Combine multiple concepts</li>
                <li>• Use filters to narrow results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Example Queries:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• "AI development tutorial"</li>
                <li>• "gaming stream highlights"</li>
                <li>• "music production tips"</li>
                <li>• "content creator resources"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
