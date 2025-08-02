import type { Metadata } from "next"
import { ArrowRight, Brain, Speech, Cpu, Video, Play, Star, CheckCircle, TrendingUp, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "AI Overview | RunAsh AI Platform",
  description:
    "Comprehensive overview of RunAsh's AI capabilities, models, and features for live streaming and content creation.",
}

export default function AIOverviewPage() {
  const aiCapabilities = [
    {
      title: "Real-time Video Analysis",
      description: "Advanced computer vision for live content analysis and enhancement",
      icon: <Video className="h-6 w-6" />,
      features: ["Object Detection", "Scene Recognition", "Quality Assessment", "Content Moderation"],
      status: "Production Ready",
    },
    {
      title: "Natural Language Processing",
      description: "Intelligent text processing and understanding for chat and content",
      icon: <Brain className="h-6 w-6" />,
      features: ["Sentiment Analysis", "Language Translation", "Content Summarization", "Auto-moderation"],
      status: "Production Ready",
    },
    {
      title: "Speech & Audio AI",
      description: "Advanced audio processing and speech recognition capabilities",
      icon: <Speech className="h-6 w-6" />,
      features: ["Speech-to-Text", "Text-to-Speech", "Audio Enhancement", "Voice Cloning"],
      status: "Beta",
    },
    {
      title: "Predictive Analytics",
      description: "AI-powered insights and predictions for content optimization",
      icon: <TrendingUp className="h-6 w-6" />,
      features: ["Engagement Prediction", "Optimal Timing", "Content Recommendations", "Audience Insights"],
      status: "Production Ready",
    },
    {
      title: "Multimodal AI",
      description: "Combined understanding of video, audio, and text content",
      icon: <Layers className="h-6 w-6" />,
      features: ["Cross-modal Analysis", "Content Synchronization", "Contextual Understanding", "Unified Insights"],
      status: "Research",
    },
    {
      title: "Edge AI Processing",
      description: "Optimized AI models for real-time edge device processing",
      icon: <Cpu className="h-6 w-6" />,
      features: ["Low Latency", "Offline Capability", "Resource Optimization", "Mobile Deployment"],
      status: "Beta",
    },
  ]

  const useCases = [
    {
      title: "Live Commerce",
      description: "AI-powered product recommendations and sales optimization",
      image: "/placeholder.svg?height=300&width=400",
      benefits: ["30% increase in conversion", "Real-time product matching", "Automated pricing optimization"],
    },
    {
      title: "Content Creation",
      description: "Intelligent content enhancement and generation tools",
      image: "/placeholder.svg?height=300&width=400",
      benefits: ["50% faster content creation", "Automated editing suggestions", "Style consistency"],
    },
    {
      title: "Audience Engagement",
      description: "Smart audience analysis and engagement optimization",
      image: "/placeholder.svg?height=300&width=400",
      benefits: ["40% higher engagement", "Personalized experiences", "Predictive insights"],
    },
  ]

  const techStack = [
    { name: "PyTorch", category: "Deep Learning", usage: "Model Training" },
    { name: "TensorFlow", category: "ML Platform", usage: "Production Deployment" },
    { name: "ONNX Runtime", category: "Inference", usage: "Cross-platform Optimization" },
    { name: "OpenCV", category: "Computer Vision", usage: "Image Processing" },
    { name: "Transformers", category: "NLP", usage: "Language Models" },
    { name: "WebRTC", category: "Streaming", usage: "Real-time Communication" },
    { name: "CUDA", category: "GPU Computing", usage: "Acceleration" },
    { name: "Docker", category: "Containerization", usage: "Model Deployment" },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              RunAsh AI Overview
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Discover the cutting-edge AI technologies powering the next generation of live streaming and content
              creation
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Explore AI Models <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">AI Capabilities</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive AI solutions designed for modern content creators and businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiCapabilities.map((capability, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
                      {capability.icon}
                    </div>
                    <Badge
                      variant={
                        capability.status === "Production Ready"
                          ? "default"
                          : capability.status === "Beta"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {capability.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{capability.title}</CardTitle>
                  <CardDescription>{capability.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {capability.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Real-World Applications
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              See how our AI technology transforms businesses across different industries
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden border border-orange-100 dark:border-orange-900/20">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Technology Stack</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Built on industry-leading technologies and frameworks
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Technologies</TabsTrigger>
              <TabsTrigger value="ml">Machine Learning</TabsTrigger>
              <TabsTrigger value="vision">Computer Vision</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack.map((tech, index) => (
                  <Card key={index} className="text-center p-4">
                    <CardContent className="p-0">
                      <div className="font-semibold text-lg mb-1">{tech.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tech.category}</div>
                      <div className="text-xs text-gray-500">{tech.usage}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ml" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack
                  .filter((tech) => ["Deep Learning", "ML Platform", "NLP"].includes(tech.category))
                  .map((tech, index) => (
                    <Card key={index} className="text-center p-4">
                      <CardContent className="p-0">
                        <div className="font-semibold text-lg mb-1">{tech.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tech.category}</div>
                        <div className="text-xs text-gray-500">{tech.usage}</div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="vision" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack
                  .filter((tech) => ["Computer Vision", "GPU Computing"].includes(tech.category))
                  .map((tech, index) => (
                    <Card key={index} className="text-center p-4">
                      <CardContent className="p-0">
                        <div className="font-semibold text-lg mb-1">{tech.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tech.category}</div>
                        <div className="text-xs text-gray-500">{tech.usage}</div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack
                  .filter((tech) => ["Inference", "Containerization", "Streaming"].includes(tech.category))
                  .map((tech, index) => (
                    <Card key={index} className="text-center p-4">
                      <CardContent className="p-0">
                        <div className="font-semibold text-lg mb-1">{tech.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tech.category}</div>
                        <div className="text-xs text-gray-500">{tech.usage}</div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience AI-Powered Streaming?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and businesses leveraging our AI technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
