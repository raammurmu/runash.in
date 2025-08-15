"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Search,
  Filter,
  FolderPlus,
  Grid3x3,
  List,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  LayoutTemplateIcon as Template,
  BarChart3,
  Settings,
} from "lucide-react"
import { ContentManager, type ContentItem, type ContentFolder } from "@/lib/content-manager"
import { useSession } from "next-auth/react"

export function ContentDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("library")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [content, setContent] = useState<ContentItem[]>([])
  const [folders, setFolders] = useState<ContentFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)

  const contentManager = ContentManager.getInstance()

  useEffect(() => {
    if (session?.user) {
      loadContent()
    }
  }, [session, selectedFolder])

  const loadContent = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const [contentData, foldersData] = await Promise.all([
        contentManager.getUserContent(session.user.id, selectedFolder),
        contentManager.getUserFolders(session.user.id),
      ])

      setContent(contentData)
      setFolders(foldersData)
    } catch (error) {
      console.error("Failed to load content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!session?.user?.id || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        await contentManager.uploadContent(file, selectedFolder, { userId: session.user.id }, (progress) => {
          const totalProgress = (i / files.length + progress / 100 / files.length) * 100
          setUploadProgress(totalProgress)
        })
      }

      await loadContent()
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSearch = async () => {
    if (!session?.user?.id) return

    try {
      const results = await contentManager.searchContent(session.user.id, searchQuery, { folder: selectedFolder })
      setContent(results)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const getTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "video":
        return <FileVideo className="h-5 w-5" />
      case "audio":
        return <FileAudio className="h-5 w-5" />
      case "image":
        return <FileImage className="h-5 w-5" />
      case "template":
        return <Template className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const filteredContent = content.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">Manage your streaming content and assets</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-400">
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Upload className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No content matches your search." : "Upload your first file to get started."}
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-400">
                <Upload className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}>
              {filteredContent.map((item) => (
                <Card key={item.id} className="group hover:shadow-md transition-shadow">
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">{getTypeIcon(item.type)}</div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white">{item.type}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                          <span>{formatFileSize(item.size)}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">{getTypeIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(item.size)}</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <Badge variant="secondary">{item.type}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <div className="text-center py-12">
            <Template className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Templates Coming Soon</h3>
            <p className="text-muted-foreground">Create and share streaming templates with the community.</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Content Analytics</h3>
            <p className="text-muted-foreground">View detailed analytics about your content performance.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Content Settings</h3>
            <p className="text-muted-foreground">Configure your content management preferences.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
