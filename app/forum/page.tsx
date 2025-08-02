import type { Metadata } from "next"
import {
  ArrowRight,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Pin,
  CheckCircle,
  Star,
  Eye,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Award,
  Flame,
  User,
  Wrench,
  Lightbulb,
  Brain,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Community Forum | RunAsh Platform",
  description:
    "Join the RunAsh community forum to discuss streaming, share tips, get help, and connect with other creators.",
}

export default function ForumPage() {
  const forumStats = [
    { label: "Total Members", value: "25,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Discussions", value: "15,000+", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Solutions", value: "8,500+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Online Now", value: "1,200+", icon: <TrendingUp className="h-5 w-5" /> },
  ]

  const categories = [
    {
      name: "General Discussion",
      description: "General streaming topics and community chat",
      topics: 2450,
      posts: 18500,
      lastPost: "2 minutes ago",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Technical Support",
      description: "Get help with technical issues and troubleshooting",
      topics: 1850,
      posts: 12300,
      lastPost: "5 minutes ago",
      icon: <Wrench className="h-6 w-6" />,
      color: "from-red-500 to-orange-500",
    },
    {
      name: "Feature Requests",
      description: "Suggest new features and improvements",
      topics: 680,
      posts: 4200,
      lastPost: "15 minutes ago",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Streaming Tips",
      description: "Share and learn streaming best practices",
      topics: 1200,
      posts: 8900,
      lastPost: "8 minutes ago",
      icon: <Star className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "AI & Technology",
      description: "Discuss AI features and technology updates",
      topics: 450,
      posts: 2800,
      lastPost: "12 minutes ago",
      icon: <Brain className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Community Showcase",
      description: "Show off your streams and get feedback",
      topics: 890,
      posts: 5600,
      lastPost: "3 minutes ago",
      icon: <Award className="h-6 w-6" />,
      color: "from-orange-500 to-yellow-500",
    },
  ]

  const trendingTopics = [
    {
      title: "New AI Background Replacement Feature - First Impressions",
      author: "StreamMaster_Pro",
      avatar: "/placeholder.svg?height=40&width=40",
      category: "AI & Technology",
      replies: 45,
      views: 1200,
      lastActivity: "5 minutes ago",
      isPinned: true,
      isHot: true,
      tags: ["AI", "Background", "New Feature"],
    },
    {
      title: "Best practices for multi-platform streaming setup?",
      author: "CreatorLife",
      avatar: "/placeholder.svg?height=40&width=40",
      category: "Streaming Tips",
      replies: 23,
      views: 680,
      lastActivity: "12 minutes ago",
      isPinned: false,
      isHot: true,
      tags: ["Multi-platform", "Setup", "Tips"],
    },
    {
      title: "Audio sync issues with external microphone - SOLVED",
      author: "TechGuru_2024",
      avatar: "/placeholder.svg?height=40&width=40",
      category: "Technical Support",
      replies: 18,
      views: 450,
      lastActivity: "18 minutes ago",
      isPinned: false,
      isHot: false,
      tags: ["Audio", "Microphone", "Solved"],
      isSolved: true,
    },
    {
      title: "Feature Request: Custom overlay animations",
      author: "DesignStreamer",
      avatar: "/placeholder.svg?height=40&width=40",
      category: "Feature Requests",
      replies: 67,
      views: 2100,
      lastActivity: "25 minutes ago",
      isPinned: false,
      isHot: true,
      tags: ["Feature Request", "Overlays", "Animation"],
    },
    {
      title: "My first month streaming results - Amazing growth!",
      author: "NewStreamer_Joy",
      avatar: "/placeholder.svg?height=40&width=40",
      category: "Community Showcase",
      replies: 34,
      views: 890,
      lastActivity: "32 minutes ago",
      isPinned: false,
      isHot: false,
      tags: ["Growth", "Results", "Success Story"],
    },
  ]

  const topContributors = [
    {
      name: "StreamMaster_Pro",
      avatar: "/placeholder.svg?height=50&width=50",
      posts: 2450,
      solutions: 180,
      reputation: 9850,
      badge: "Expert",
    },
    {
      name: "TechGuru_2024",
      avatar: "/placeholder.svg?height=50&width=50",
      posts: 1890,
      solutions: 145,
      reputation: 7200,
      badge: "Helper",
    },
    {
      name: "CreatorLife",
      avatar: "/placeholder.svg?height=50&width=50",
      posts: 1650,
      solutions: 98,
      reputation: 5800,
      badge: "Contributor",
    },
    {
      name: "DesignStreamer",
      avatar: "/placeholder.svg?height=50&width=50",
      posts: 1200,
      solutions: 76,
      reputation: 4500,
      badge: "Active",
    },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              Community Forum
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Connect with fellow creators, get help, share tips, and be part of the RunAsh streaming community
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Join Discussion <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                Browse Topics <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Forum Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {forumStats.map((stat, index) => (
              <Card key={index} className="text-center border border-orange-100 dark:border-orange-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Navigation */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search discussions, topics, or users..." className="pl-10 pr-4 py-2 w-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Forum Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="trending" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="solved">Solved</TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-6">
                  <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <Card
                        key={index}
                        className="border border-orange-100 dark:border-orange-900/20 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={topic.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{topic.author[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {topic.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                                {topic.isHot && <Flame className="h-4 w-4 text-red-500" />}
                                {topic.isSolved && <CheckCircle className="h-4 w-4 text-green-500" />}
                                <h3 className="font-semibold text-lg hover:text-orange-600 cursor-pointer">
                                  {topic.title}
                                </h3>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {topic.author}
                                </span>
                                <Badge variant="outline">{topic.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {topic.lastActivity}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {topic.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    {topic.replies}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {topic.views}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-6">
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Recent Discussions</h3>
                    <p className="text-gray-600 dark:text-gray-400">Recent forum topics will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="unanswered" className="mt-6">
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Unanswered Questions</h3>
                    <p className="text-gray-600 dark:text-gray-400">Help the community by answering these questions</p>
                  </div>
                </TabsContent>

                <TabsContent value="solved" className="mt-6">
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Solved Topics</h3>
                    <p className="text-gray-600 dark:text-gray-400">Browse solved discussions for quick answers</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card className="border border-orange-100 dark:border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.slice(0, 4).map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>{category.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{category.topics} topics</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-3 text-orange-600">
                    View All Categories
                  </Button>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="border border-orange-100 dark:border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{contributor.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {contributor.solutions} solutions
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contributor.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-orange-100 dark:border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Topic
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Search className="h-4 w-4 mr-2" />
                      Search Forum
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with thousands of streamers, get expert help, and share your knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Browse as Guest
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
</merged_code>
