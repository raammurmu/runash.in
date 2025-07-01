"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  FileText,
  User,
  Video,
  ImageIcon,
  Clock,
  TrendingUp,
  BarChart3,
  Sparkles,
  Filter,
  Eye,
  ThumbsUp,
  Share2,
  Loader2,
} from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useSearch, useSearchAnalytics } from "@/hooks/use-search"
import type { SearchOptions, SearchResult } from "@/lib/search-types"

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("search")
  const { results, loading, error } = useSearch()
  const { analytics, loading: analyticsLoading } = useSearchAnalytics()

  const handleSearch = (query: string, options: SearchOptions) => {
    console.log("Search:", query, options)
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "stream":
        return <Video className="h-4 w-4" />
      case "content":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "file":
        return "bg-green-100 text-green-800 border-green-200"
      case "stream":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "content":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatRelevanceScore = (score: number) => {
    return Math.round(score * 100)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Search</h1>
          <p className="text-muted-foreground">Discover content with intelligent semantic search powered by AI</p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users, files, streams, and content..."
          showFilters={true}
          className="w-full"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Results */}
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Searching...</span>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : results ? (
            <>
              {/* Search Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Found {results.total} results in {results.response_time_ms}ms
                  </span>
                  {results.suggestions && results.suggestions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">
                        Try: {results.suggestions.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Facets */}
              {results.facets && Object.keys(results.facets).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filter Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(results.facets).map(([facetName, facetValues]) => (
                      <div key={facetName}>
                        <h4 className="font-medium mb-2 capitalize">{facetName.replace("_", " ")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {facetValues.map(({ value, count }) => (
                            <Badge key={value} variant="outline" className="cursor-pointer">
                              {value} ({count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Results List */}
              <div className="space-y-4">
                {results.results.map((result: SearchResult) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-center gap-3">
                            {getDocumentIcon(result.document.document_type)}
                            <Badge variant="outline" className={getDocumentTypeColor(result.document.document_type)}>
                              {result.document.document_type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Relevance: {formatRelevanceScore(result.relevance_score)}%
                            </span>
                          </div>

                          {/* Title and Content */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{result.document.title}</h3>
                            <p className="text-muted-foreground line-clamp-3">{result.document.content}</p>
                          </div>

                          {/* Tags and Metadata */}
                          <div className="flex items-center gap-4">
                            {result.document.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Tags:</span>
                                <div className="flex gap-1">
                                  {result.document.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                  {result.document.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{result.document.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(result.document.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Progress Bar for Relevance */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Relevance Score</span>
                              <span className="font-medium">{formatRelevanceScore(result.relevance_score)}%</span>
                            </div>
                            <Progress value={formatRelevanceScore(result.relevance_score)} className="h-2" />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {results.results.length < results.total && (
                <div className="flex justify-center">
                  <Button variant="outline">Load More Results</Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Searching</h3>
                <p className="text-muted-foreground text-center">
                  Use the search bar above to find users, files, streams, and content
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : analytics ? (
            <>
              {/* Analytics Overview */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.total_queries}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.avg_response_time)}ms</div>
                    <p className="text-xs text-muted-foreground">Average search speed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Popular Queries</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.popular_queries.length}</div>
                    <p className="text-xs text-muted-foreground">Unique search terms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Results</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.top_results.length}</div>
                    <p className="text-xs text-muted-foreground">Most viewed results</p>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Queries */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Search Queries</CardTitle>
                  <CardDescription>Most searched terms in the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popular_queries.map((query, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span>{query.query}</span>
                        </div>
                        <Badge variant="secondary">{query.count} searches</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Search Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Activity</CardTitle>
                  <CardDescription>Daily search volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.search_trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (trend.queries / Math.max(...analytics.search_trends.map((t) => t.queries))) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{trend.queries}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Viewed Results</CardTitle>
                  <CardDescription>Content that gets the most clicks from search</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.top_results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{result.title}</p>
                            <p className="text-sm text-muted-foreground">ID: {result.document_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{result.clicks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <AlertDescription>Unable to load search analytics. Please try again later.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Content
              </CardTitle>
              <CardDescription>Popular content and searches right now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Trending Searches */}
                <div>
                  <h3 className="font-semibold mb-4">🔥 Trending Searches</h3>
                  <div className="space-y-3">
                    {[
                      { query: "AI art generation", trend: "+150%" },
                      { query: "streaming setup 2024", trend: "+89%" },
                      { query: "react hooks tutorial", trend: "+67%" },
                      { query: "music production tips", trend: "+45%" },
                      { query: "gaming highlights", trend: "+32%" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                        <span className="text-sm">{item.query}</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {item.trend}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Tags */}
                <div>
                  <h3 className="font-semibold mb-4">📈 Trending Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "ai",
                      "tutorial",
                      "gaming",
                      "music",
                      "art",
                      "coding",
                      "streaming",
                      "tech",
                      "design",
                      "productivity",
                    ].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-orange-100">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Content Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Ultimate Streaming Setup Guide",
                type: "tutorial",
                views: "12.5K",
                trend: "+200%",
              },
              {
                title: "AI Art Creation Workshop",
                type: "stream",
                views: "8.3K",
                trend: "+180%",
              },
              {
                title: "React Performance Tips",
                type: "content",
                views: "6.7K",
                trend: "+120%",
              },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {item.trend}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {item.views} views
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
