import type { Metadata } from "next"
import {
  ArrowRight,
  Brain,
  Download,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Database,
  Cpu,
  CheckCircle,
  Volume2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "AI Models | RunAsh AI Platform",
  description:
    "Explore RunAsh's collection of AI models for live streaming, content creation, and business automation.",
}

export default function ModelsPage() {
  const featuredModels = [
    {
      name: "RunAsh-Vision-Pro",
      description: "Advanced computer vision model for real-time video analysis and enhancement",
      category: "Computer Vision",
      version: "v2.1.0",
      size: "1.2GB",
      accuracy: 94.5,
      latency: "15ms",
      downloads: "50K+",
      likes: 1250,
      status: "Production",
      tags: ["Video Analysis", "Real-time", "Edge Optimized"],
      capabilities: [
        "Object Detection & Tracking",
        "Scene Understanding",
        "Quality Assessment",
        "Content Moderation",
        "Background Segmentation",
      ],
      benchmarks: {
        "COCO mAP": 0.68,
        "FPS (RTX 4090)": 120,
        "Mobile FPS": 30,
        "Memory Usage": "2.1GB",
      },
    },
    {
      name: "RunAsh-NLP-Chat",
      description: "Natural language processing model optimized for live chat and content understanding",
      category: "Natural Language",
      version: "v1.8.2",
      size: "850MB",
      accuracy: 96.2,
      latency: "8ms",
      downloads: "75K+",
      likes: 2100,
      status: "Production",
      tags: ["Chat Analysis", "Sentiment", "Multilingual"],
      capabilities: [
        "Sentiment Analysis",
        "Language Detection",
        "Content Summarization",
        "Toxicity Detection",
        "Intent Recognition",
      ],
      benchmarks: {
        "GLUE Score": 89.2,
        Languages: 25,
        "Tokens/sec": 1500,
        "Memory Usage": "1.8GB",
      },
    },
    {
      name: "RunAsh-Audio-Pro",
      description: "Advanced audio processing model for speech recognition and enhancement",
      category: "Audio Processing",
      version: "v1.5.1",
      size: "650MB",
      accuracy: 97.8,
      latency: "12ms",
      downloads: "35K+",
      likes: 890,
      status: "Beta",
      tags: ["Speech-to-Text", "Audio Enhancement", "Real-time"],
      capabilities: [
        "Speech Recognition",
        "Noise Reduction",
        "Voice Enhancement",
        "Speaker Identification",
        "Audio Classification",
      ],
      benchmarks: {
        WER: 2.1,
        "SNR Improvement": "15dB",
        "Processing Speed": "4x Real-time",
        "Memory Usage": "1.2GB",
      },
    },
    {
      name: "RunAsh-Recommend",
      description: "Intelligent recommendation engine for content and product suggestions",
      category: "Recommendation",
      version: "v3.0.0",
      size: "420MB",
      accuracy: 91.7,
      latency: "5ms",
      downloads: "28K+",
      likes: 650,
      status: "Production",
      tags: ["Recommendations", "Personalization", "E-commerce"],
      capabilities: [
        "Content Recommendations",
        "Product Matching",
        "User Behavior Analysis",
        "Trend Prediction",
        "Cross-platform Sync",
      ],
      benchmarks: {
        "Precision@10": 0.85,
        "Recall@10": 0.78,
        "CTR Improvement": "35%",
        "Memory Usage": "800MB",
      },
    },
  ]

  const modelCategories = [
    {
      name: "Computer Vision",
      count: 12,
      description: "Models for image and video analysis",
      icon: <Eye className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Natural Language",
      count: 8,
      description: "Text processing and understanding",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Audio Processing",
      count: 6,
      description: "Speech and audio analysis",
      icon: <Volume2 className="h-6 w-6" />,
      color: "from-purple-500 to-violet-500",
    },
    {
      name: "Recommendation",
      count: 4,
      description: "Personalization and suggestions",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Multimodal",
      count: 3,
      description: "Cross-modal understanding",
      icon: <Brain className="h-6 w-6" />,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Edge Optimized",
      count: 15,
      description: "Lightweight models for mobile",
      icon: <Cpu className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const usageStats = [
    { metric: "Total Downloads", value: "2.5M+", change: "+15%" },
    { metric: "Active Deployments", value: "45K+", change: "+22%" },
    { metric: "API Calls/Month", value: "1.2B+", change: "+35%" },
    { metric: "Developer Community", value: "12K+", change: "+18%" },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              AI Models Hub
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Discover, deploy, and integrate state-of-the-art AI models designed for live streaming and content
              creation
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Browse Models <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                API Documentation
              </Button>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {usageStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.metric}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Model Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Model Categories</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive collection of AI models organized by use case
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelCategories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-orange-100 dark:border-orange-900/20"
              >
                <CardHeader>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} w-fit mb-4`}>{category.icon}</div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.count} models</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-950">
                    Explore Models <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Models</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Our most popular and powerful AI models ready for production use
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredModels.map((model, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">{model.name}</CardTitle>
                      <CardDescription className="text-base">{model.description}</CardDescription>
                    </div>
                    <Badge variant={model.status === "Production" ? "default" : "secondary"}>{model.status}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{model.accuracy}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{model.latency}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Latency</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="capabilities" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                      <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="capabilities" className="mt-4">
                      <ul className="space-y-2">
                        {model.capabilities.map((capability, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="benchmarks" className="mt-4">
                      <div className="space-y-3">
                        {Object.entries(model.benchmarks).map(([metric, value], idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{metric}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {model.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {model.likes}
                      </span>
                      <span>{model.size}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Demo
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
                        Deploy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guide */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Easy Integration</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Get started with our models in minutes using our comprehensive APIs and SDKs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Quick Start Guide</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Install SDK</h4>
                    <p className="text-gray-600 dark:text-gray-400">Install our Python or JavaScript SDK</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Authenticate</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get your API key and configure authentication</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Deploy Model</h4>
                    <p className="text-gray-600 dark:text-gray-400">Choose and deploy your model with one API call</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Start Inferencing</h4>
                    <p className="text-gray-600 dark:text-gray-400">Send data and receive AI-powered insights</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
              <div className="mb-4 text-gray-400"># Install RunAsh SDK</div>
              <div className="mb-4">pip install runash-ai</div>

              <div className="mb-4 text-gray-400"># Initialize client</div>
              <div className="mb-4">
                from runash import RunAshClient
                <br />
                client = RunAshClient(api_key="your_key")
              </div>

              <div className="mb-4 text-gray-400"># Deploy model</div>
              <div className="mb-4">
                model = client.deploy("runash-vision-pro")
                <br />
                result = model.analyze(video_stream)
              </div>

              <div className="text-gray-400"># Get results</div>
              <div>print(result.objects_detected)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build with AI?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start integrating our AI models into your applications today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Get API Key
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
