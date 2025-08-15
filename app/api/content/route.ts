import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ContentManager } from "@/lib/content-manager"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")
    const folder = searchParams.get("folder")
    const query = searchParams.get("query")

    const contentManager = ContentManager.getInstance()

    switch (action) {
      case "list":
        const content = await contentManager.getUserContent(session.user.id, folder || undefined)
        return NextResponse.json({ content })

      case "search":
        if (!query) {
          return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
        }
        const results = await contentManager.searchContent(session.user.id, query, {
          folder: folder || undefined,
        })
        return NextResponse.json({ content: results })

      case "analytics":
        const analytics = await contentManager.getContentAnalytics(session.user.id)
        return NextResponse.json(analytics)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Content API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const action = formData.get("action") as string

    const contentManager = ContentManager.getInstance()

    switch (action) {
      case "upload":
        const file = formData.get("file") as File
        const folder = (formData.get("folder") as string) || ""
        const tags = JSON.parse((formData.get("tags") as string) || "[]")
        const isPublic = formData.get("isPublic") === "true"

        if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const contentItem = await contentManager.uploadContent(file, folder, {
          userId: session.user.id,
          tags,
          isPublic,
        })

        return NextResponse.json({ content: contentItem })

      case "create-folder":
        const folderName = formData.get("name") as string
        const parentPath = (formData.get("parentPath") as string) || ""

        if (!folderName) {
          return NextResponse.json({ error: "Folder name required" }, { status: 400 })
        }

        const newFolder = await contentManager.createFolder(folderName, parentPath, session.user.id)
        return NextResponse.json({ folder: newFolder })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Content upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contentId } = await req.json()

    if (!contentId) {
      return NextResponse.json({ error: "Content ID required" }, { status: 400 })
    }

    const contentManager = ContentManager.getInstance()
    await contentManager.deleteContent(contentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Content delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
