import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, AlertTriangle, Bug, Plus, ArrowUp, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Changelog | RunAsh Platform",
  description: "Stay updated with the latest features, improvements, and bug fixes in RunAsh platform.",
}

export default function ChangelogPage() {
  const releases = [
    {
      version: "v3.2.0",
      date: "2025-01-15",
      type: "major",
      title: "AI-Powered Stream Enhancement 2.0",
      description: "Major update introducing advanced AI features and improved performance",
      changes: [
        {
          type: "new",
          category: "AI Features",
          title: "Real-time Background Replacement",
          description: "Advanced AI background replacement with 50+ professional backgrounds",
        },
        {
          type: "new",
          category: "Analytics",
          title: "Predictive Audience Insights",
          description: "AI-powered predictions for optimal streaming times and content recommendations",
        },
        {
          type: "improvement",
          category: "Performance",
          title: "40% Faster Stream Processing",
          description: "Optimized video processing pipeline reducing latency and improving quality",
        },
        {
          type: "improvement",
          category: "Mobile",
          title: "Enhanced Mobile Streaming",
          description: "Improved mobile app with better camera controls and stability",
        },
        {
          type: "fix",
          category: "Bug Fixes",
          title: "Chat Synchronization Issues",
          description: "Fixed chat messages not syncing properly across multiple platforms",
        },
      ],
    },
    {
      version: "v3.1.5",
      date: "2025-01-08",
      type: "patch",
      title: "Security & Performance Updates",
      description: "Important security patches and performance improvements",
      changes: [
        {
          type: "security",
          category: "Security",
          title: "Enhanced Authentication",
          description: "Implemented additional security measures for user authentication",
        },
        {
          type: "improvement",
          category: "Performance",
          title: "Database Optimization",
          description: "Improved database queries reducing response times by 25%",
        },
        {
          type: "fix",
          category: "Bug Fixes",
          title: "Stream Recording Issues",
          description: "Fixed intermittent issues with stream recording on certain devices",
        },
      ],
    },
    {
      version: "v3.1.0",
      date: "2025-01-01",
      type: "minor",
      title: "Multi-Platform Chat & New Integrations",
      description: "Unified chat experience and expanded platform integrations",
      changes: [
        {
          type: "new",
          category: "Chat",
          title: "Unified Multi-Platform Chat",
          description: "Manage chat from YouTube, Twitch, Facebook, and more in one interface",
        },
        {
          type: "new",
          category: "Integrations",
          title: "TikTok Live Integration",
          description: "Full support for TikTok Live streaming with vertical video optimization",
        },
        {
          type: "new",
          category: "Features",
          title: "Custom Overlay Templates",
          description: "50+ new professional overlay templates for different content types",
        },
        {
          type: "improvement",
          category: "UI/UX",
          title: "Redesigned Dashboard",
          description: "Cleaner, more intuitive dashboard with improved navigation",
        },
        {
          type: "fix",
          category: "Bug Fixes",
          title: "Audio Sync Issues",
          description: "Resolved audio synchronization problems in multi-camera setups",
        },
      ],
    },
    {
      version: "v3.0.0",
      date: "2024-12-15",
      type: "major",
      title: "RunAsh 3.0 - Complete Platform Redesign",
      description: "Major release with completely redesigned interface and new AI capabilities",
      changes: [
        {
          type: "new",
          category: "AI Features",
          title: "AI Stream Director",
          description: "Intelligent scene switching and camera angle optimization using AI",
        },
        {
          type: "new",
          category: "Platform",
          title: "New Streaming Engine",
          description: "Rebuilt streaming engine with 60% better performance and reliability",
        },
        {
          type: "new",
          category: "Analytics",
          title: "Advanced Analytics Suite",
          description: "Comprehensive analytics with real-time insights and audience behavior tracking",
        },
        {
          type: "improvement",
          category: "UI/UX",
          title: "Complete UI Redesign",
          description: "Modern, intuitive interface with improved accessibility and dark mode",
        },
        {
          type: "breaking",
          category: "API",
          title: "API v3.0 Release",
          description: "New API version with breaking changes - migration guide available",
        },
      ],
    },
    {
      version: "v2.8.3",
      date: "2024-12-01",
      type: "patch",
      title: "Holiday Season Optimizations",
      description: "Performance improvements for high-traffic periods",
      changes: [
        {
          type: "improvement",
          category: "Performance",
          title: "Server Scaling Improvements",
          description: "Enhanced auto-scaling to handle increased holiday traffic",
        },
        {
          type: "improvement",
          category: "Reliability",
          title: "Connection Stability",
          description: "Improved connection reliability during peak usage times",
        },
        {
          type: "fix",
          category: "Bug Fixes",
          title: "Memory Leak in Mobile App",
          description: "Fixed memory leak causing app crashes on extended streaming sessions",
        },
      ],
    },
    {
      version: "v2.8.0",
      date: "2024-11-20",
      type: "minor",
      title: "Advanced Moderation & Community Tools",
      description: "Enhanced moderation capabilities and community management features",
      changes: [
        {
          type: "new",
          category: "Moderation",
          title: "AI-Powered Auto-Moderation",
          description: "Intelligent chat moderation with customizable sensitivity levels",
        },
        {
          type: "new",
          category: "Community",
          title: "Subscriber-Only Chat",
          description: "Option to restrict chat to subscribers and VIP members",
        },
        {
          type: "new",
          category: "Features",
          title: "Stream Scheduling",
          description: "Schedule streams in advance with automatic notifications",
        },
        {
          type: "improvement",
          category: "Mobile",
          title: "iOS App Performance",
          description: "Significant performance improvements for iOS streaming app",
        },
      ],
    },
  ]

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Plus className="h-4 w-4 text-green-600" />
      case "improvement":
        return <ArrowUp className="h-4 w-4 text-blue-600" />
      case "fix":
        return <Bug className="h-4 w-4 text-orange-600" />
      case "security":
        return <Shield className="h-4 w-4 text-purple-600" />
      case "breaking":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
      case "minor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "patch":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              Changelog
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl">
              Stay updated with the latest features, improvements, and bug fixes in RunAsh platform
            </p>
          </div>
        </div>
      </section>

      {/* Changelog Content */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="space-y-12">
            {releases.map((release, index) => (
              <div key={release.version}>
                <Card className="border border-orange-100 dark:border-orange-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className={getVersionBadgeColor(release.type)}>{release.version}</Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(release.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {release.type} Release
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{release.title}</CardTitle>
                    <CardDescription className="text-base">{release.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {release.changes.map((change, changeIndex) => (
                        <div
                          key={changeIndex}
                          className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div className="flex-shrink-0 mt-0.5">{getChangeIcon(change.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{change.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {change.category}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{change.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {index < releases.length - 1 && (
                  <div className="flex justify-center my-8">
                    <Separator className="w-24" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Showing recent releases. View complete changelog history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-2 border border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition-colors">
                View All Releases
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Release Notes Footer */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Get notified about new releases, features, and important updates directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-yellow-500 text-white rounded-lg hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
