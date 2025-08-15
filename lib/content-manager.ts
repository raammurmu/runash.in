import { EnhancedCloudStorage } from "./enhanced-cloud-storage"
import { RecordingService } from "./recording-service"
import { BackgroundSync } from "./background-sync"

export interface ContentItem {
  id: string
  name: string
  type: "video" | "audio" | "image" | "document" | "template"
  size: number
  url: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  userId: string
  tags: string[]
  metadata: Record<string, any>
  status: "uploading" | "processing" | "ready" | "failed"
  folder: string
  isPublic: boolean
  downloadCount: number
  viewCount: number
}

export interface ContentFolder {
  id: string
  name: string
  path: string
  parentId?: string
  itemCount: number
  totalSize: number
  createdAt: string
  userId: string
}

export interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnailUrl: string
  fileUrl: string
  userId: string
  isPublic: boolean
  downloadCount: number
  rating: number
  tags: string[]
  createdAt: string
}

export class ContentManager {
  private static instance: ContentManager
  private cloudStorage: EnhancedCloudStorage
  private recordingService: RecordingService
  private backgroundSync: BackgroundSync
  private contentListeners: ((content: ContentItem[]) => void)[] = []

  private constructor() {
    this.cloudStorage = EnhancedCloudStorage.getInstance()
    this.recordingService = RecordingService.getInstance()
    this.backgroundSync = BackgroundSync.getInstance()
  }

  public static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager()
    }
    return ContentManager.instance
  }

  // Content CRUD operations
  public async uploadContent(
    file: File,
    folder = "",
    metadata: Record<string, any> = {},
    onProgress?: (progress: number) => void,
  ): Promise<ContentItem> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const key = `users/${metadata.userId}/${folder}/${Date.now()}-${file.name}`

      // Upload to cloud storage with progress tracking
      const url = await this.cloudStorage.uploadFile(
        key,
        buffer,
        file.type,
        {
          originalName: file.name,
          uploadedBy: metadata.userId,
          uploadedAt: new Date().toISOString(),
          ...metadata,
        },
        onProgress ? (progress) => onProgress(progress.percentage) : undefined,
      )

      // Create content item
      const contentItem: ContentItem = {
        id: `content-${Date.now()}`,
        name: file.name,
        type: this.getContentType(file.type),
        size: file.size,
        url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: metadata.userId,
        tags: metadata.tags || [],
        metadata,
        status: "ready",
        folder,
        isPublic: metadata.isPublic || false,
        downloadCount: 0,
        viewCount: 0,
      }

      // Generate thumbnail for videos and images
      if (contentItem.type === "video" || contentItem.type === "image") {
        contentItem.thumbnailUrl = await this.generateThumbnail(contentItem)
      }

      // Sync to background
      this.backgroundSync.addToSyncQueue({
        type: "content",
        action: "create",
        data: contentItem,
      })

      this.notifyContentListeners()
      return contentItem
    } catch (error) {
      console.error("Failed to upload content:", error)
      throw error
    }
  }

  public async getUserContent(userId: string, folder?: string): Promise<ContentItem[]> {
    try {
      const prefix = folder ? `users/${userId}/${folder}/` : `users/${userId}/`
      const { files } = await this.cloudStorage.listFiles(prefix)

      return files.map((file) => ({
        id: file.key,
        name: file.name,
        type: this.getContentType(file.contentType),
        size: file.size,
        url: file.url,
        thumbnailUrl: this.getThumbnailUrl(file.key),
        createdAt: file.lastModified.toISOString(),
        updatedAt: file.lastModified.toISOString(),
        userId,
        tags: file.tags || [],
        metadata: file.metadata || {},
        status: "ready",
        folder: file.folder,
        isPublic: false,
        downloadCount: 0,
        viewCount: 0,
      }))
    } catch (error) {
      console.error("Failed to get user content:", error)
      return []
    }
  }

  public async deleteContent(contentId: string): Promise<void> {
    try {
      await this.cloudStorage.deleteFile(contentId)
      this.notifyContentListeners()
    } catch (error) {
      console.error("Failed to delete content:", error)
      throw error
    }
  }

  public async moveContent(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      await this.cloudStorage.moveFile(sourceKey, destinationKey)
      this.notifyContentListeners()
    } catch (error) {
      console.error("Failed to move content:", error)
      throw error
    }
  }

  // Template management
  public async createTemplate(
    name: string,
    description: string,
    category: string,
    file: File,
    userId: string,
    isPublic = false,
  ): Promise<ContentTemplate> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const templateId = `template-${Date.now()}`

      const fileUrl = await this.cloudStorage.uploadTemplate(userId, buffer, templateId)
      const thumbnailUrl = await this.generateTemplateThumbnail(templateId)

      const template: ContentTemplate = {
        id: templateId,
        name,
        description,
        category,
        thumbnailUrl,
        fileUrl,
        userId,
        isPublic,
        downloadCount: 0,
        rating: 0,
        tags: [],
        createdAt: new Date().toISOString(),
      }

      return template
    } catch (error) {
      console.error("Failed to create template:", error)
      throw error
    }
  }

  public async getTemplates(category?: string, isPublic?: boolean): Promise<ContentTemplate[]> {
    // In a real implementation, this would query a database
    // For now, return mock data
    return []
  }

  // Folder management
  public async createFolder(name: string, parentPath: string, userId: string): Promise<ContentFolder> {
    const folder: ContentFolder = {
      id: `folder-${Date.now()}`,
      name,
      path: parentPath ? `${parentPath}/${name}` : name,
      parentId: parentPath || undefined,
      itemCount: 0,
      totalSize: 0,
      createdAt: new Date().toISOString(),
      userId,
    }

    return folder
  }

  public async getUserFolders(userId: string): Promise<ContentFolder[]> {
    // In a real implementation, this would query a database
    return []
  }

  // Search and filtering
  public async searchContent(
    userId: string,
    query: string,
    filters: {
      type?: string[]
      tags?: string[]
      dateRange?: { start: string; end: string }
      folder?: string
    } = {},
  ): Promise<ContentItem[]> {
    const allContent = await this.getUserContent(userId, filters.folder)

    return allContent.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesType = !filters.type || filters.type.includes(item.type)
      const matchesTags = !filters.tags || filters.tags.some((tag) => item.tags.includes(tag))

      let matchesDate = true
      if (filters.dateRange) {
        const itemDate = new Date(item.createdAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        matchesDate = itemDate >= startDate && itemDate <= endDate
      }

      return matchesQuery && matchesType && matchesTags && matchesDate
    })
  }

  // Analytics and insights
  public async getContentAnalytics(userId: string): Promise<{
    totalItems: number
    totalSize: number
    itemsByType: Record<string, number>
    sizeByType: Record<string, number>
    recentUploads: ContentItem[]
    popularContent: ContentItem[]
  }> {
    const content = await this.getUserContent(userId)

    const totalItems = content.length
    const totalSize = content.reduce((sum, item) => sum + item.size, 0)

    const itemsByType: Record<string, number> = {}
    const sizeByType: Record<string, number> = {}

    content.forEach((item) => {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1
      sizeByType[item.type] = (sizeByType[item.type] || 0) + item.size
    })

    const recentUploads = content
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const popularContent = content.sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)

    return {
      totalItems,
      totalSize,
      itemsByType,
      sizeByType,
      recentUploads,
      popularContent,
    }
  }

  // Event listeners
  public onContentChange(callback: (content: ContentItem[]) => void): () => void {
    this.contentListeners.push(callback)
    return () => {
      this.contentListeners = this.contentListeners.filter((cb) => cb !== callback)
    }
  }

  private notifyContentListeners(): void {
    // In a real implementation, this would fetch updated content
    this.contentListeners.forEach((listener) => listener([]))
  }

  // Utility methods
  private getContentType(mimeType: string): ContentItem["type"] {
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.includes("template")) return "template"
    return "document"
  }

  private async generateThumbnail(content: ContentItem): Promise<string> {
    // In a real implementation, this would generate actual thumbnails
    return `/placeholder.svg?height=200&width=300&query=${content.type} thumbnail`
  }

  private getThumbnailUrl(key: string): string {
    // Generate thumbnail URL based on file key
    return `/placeholder.svg?height=200&width=300&query=file thumbnail`
  }

  private async generateTemplateThumbnail(templateId: string): Promise<string> {
    return `/placeholder.svg?height=200&width=300&query=template thumbnail`
  }
}
