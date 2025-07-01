"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, Filter, Sparkles, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSearch, useSearchSuggestions } from "@/hooks/use-search"
import type { SearchOptions } from "@/lib/search-types"

interface SearchBarProps {
  onSearch?: (query: string, options: SearchOptions) => void
  placeholder?: string
  showFilters?: boolean
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Search everything...",
  showFilters = true,
  className = "",
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    type: string
    documentTypes: string[]
    tags: string[]
  }>({
    type: "semantic",
    documentTypes: [],
    tags: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { query, setQuery, results, loading, options, updateOptions, search } = useSearch()
  const { suggestions } = useSearchSuggestions(query)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    const searchOptions: SearchOptions = {
      query: finalQuery,
      type: selectedFilters.type as any,
      filters: {
        document_type: selectedFilters.documentTypes.length > 0 ? selectedFilters.documentTypes : undefined,
        tags: selectedFilters.tags.length > 0 ? selectedFilters.tags : undefined,
      },
    }

    updateOptions(searchOptions)
    search(searchOptions)
    onSearch?.(finalQuery, searchOptions)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const addFilter = (type: "documentTypes" | "tags", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }))
  }

  const removeFilter = (type: "documentTypes" | "tags", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }))
  }

  const popularSearches = [
    "gaming tutorials",
    "streaming setup",
    "react development",
    "music production",
    "digital art",
  ]

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20 h-12 text-base bg-background border-2 focus:border-orange-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
          {showFilters && (
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedFilters.documentTypes.length > 0 || selectedFilters.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedFilters.documentTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter("documentTypes", type)}
            >
              {type} <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {selectedFilters.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeFilter("tags", tag)}>
              #{tag} <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Dropdown */}
      {isOpen && (
        <Card ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && (
              <>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Popular Searches</span>
                  </div>
                  <div className="space-y-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Quick Filters */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Quick Filters</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground mb-2 block">Content Type</span>
                      <div className="flex flex-wrap gap-2">
                        {["user", "file", "stream", "content"].map((type) => (
                          <Badge
                            key={type}
                            variant={selectedFilters.documentTypes.includes(type) ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() =>
                              selectedFilters.documentTypes.includes(type)
                                ? removeFilter("documentTypes", type)
                                : addFilter("documentTypes", type)
                            }
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground mb-2 block">Popular Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {["gaming", "tutorial", "music", "art", "coding"].map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedFilters.tags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() =>
                              selectedFilters.tags.includes(tag) ? removeFilter("tags", tag) : addFilter("tags", tag)
                            }
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Search Type Toggle */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Search Mode</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: "semantic", label: "Smart", icon: Sparkles },
                  { value: "keyword", label: "Exact", icon: Search },
                  { value: "hybrid", label: "Mixed", icon: Filter },
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={selectedFilters.type === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilters((prev) => ({ ...prev, type: value }))}
                    className="flex items-center gap-1"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
