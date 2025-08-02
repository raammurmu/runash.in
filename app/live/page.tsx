import type { Metadata } from "next"
import { ArrowRight, Play, Video, Smartphone, MessageSquare, Zap, Globe, BarChart, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Live Streaming | RunAsh Platform",
  description:
    "Professional live streaming platform with AI-powered features, multi-platform broadcasting, and real-time analytics.",
}

export default function LivePage() {
  const streamingFeatures = [
    {
      title: "Multi-Platform Broadcasting",
      description: "Stream simultaneously to YouTube, Twitch, Facebook, and 20+ platforms",
      icon: <Globe className="h-6 w-6" />,
      features: ["Simultaneous streaming", "Platform optimization", "Custom RTMP", "Auto-scheduling"],
      status: "Available",
    },
    {
      title: "AI-Powered Enhancement",
      description: "Real-time video and audio enhancement using advanced AI algorithms",
      icon: <Zap className="h-6 w-6" />,
      features: ["Auto lighting correction", "Noise reduction", "Background blur", "Voice enhancement"],
      status: "Available",
    },
    {
      title: "Interactive Chat",
      description: "Unified chat management across all streaming platforms",
      icon: <MessageSquare className="h-6 w-6" />,
      features: ["Multi-platform chat", "Auto-moderation", "Custom commands", "Viewer analytics"],
      status: "Available",
    },
    {
      title: "Professional Tools",
      description: "Studio-grade streaming tools for content creators and businesses",
      icon: <Video className="h-6 w-6" />,
      features: ["Scene transitions", "Overlay management", "Green screen", "Multi-camera support"],
      status: "Available",
    },
    {
      title: "Real-Time Analytics",
      description: "Comprehensive analytics and insights for your live streams",
      icon: <BarChart className="h-6 w-6" />,
      features: ["Viewer metrics", "Engagement tracking", "Revenue analytics", "Performance insights"],
      status: "Available",
    },
    {
      title: "Mobile Streaming",
      description: "Professional mobile streaming with full feature support",
      icon: <Smartphone className="h-6 w-6" />,
      features: ["iOS/Android apps", "Mobile optimization", "Touch controls", "Offline recording"],
      status: "Beta",
    },
  ]

  const streamingStats = [
    { label: "Active Streamers", value: "50K+", change: "+25%" },
    { label: "Monthly Hours", value: "2M+", change: "+40%" },
    { label: "Peak Concurrent", value: "100K+", change: "+30%" },
    { label: "Global Reach", value: "150+", change: "+15%" },
  ]

  const platformSupport = [
    { name: "YouTube Live", logo: "🔴", status: "Full Support", features: ["1080p60", "Chat", "Analytics"] },
    { name: "Twitch", logo: "💜", status: "Full Support", features: ["4K", "Extensions", "Clips"] },
    { name: "Facebook Live", logo: "📘", status: "Full Support", features: ["Stories", "Pages", "Groups"] },
    { name: "Instagram Live", logo: "📷", status: "Full Support", features: ["IGTV", "Stories", "Reels"] },
    { name: "TikTok Live", logo: "🎵", status: "Full Support", features: ["Vertical", "Effects", "Gifts"] },
    { name: "LinkedIn Live", logo: "💼", status: "Full Support", features: ["Professional", "Events", "Articles"] },
    { name: "Custom RTMP", logo: "🔧", status: "Full Support", features: ["Any Platform", "Custom Setup", "Advanced"] },
    { name: "Discord", logo: "🎮", status: "Beta", features: ["Voice Channels", "Screen Share", "Go Live"] },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$19",
      description: "Perfect for new streamers",
      features: [
        "720p streaming",
        "2 platforms simultaneously",
        "Basic chat moderation",
        "5 hours/month recording",
        "Standard support",
      ],
      popular: false,
    },
    {
      name: "Creator",
      price: "$49",
      description: "For growing content creators",
      features: [
        "1080p60 streaming",
        "5 platforms simultaneously",
        "Advanced AI features",
        "50 hours/month recording",
        "Priority support",
        "Custom overlays",
        "Analytics dashboard",
      ],
      popular: true,
    },
    {
      name: "Professional",
      price: "$99",
      description: "For professional streamers",
      features: [
        "4K streaming",
        "Unlimited platforms",
        "All AI features",
        "Unlimited recording",
        "24/7 support",
        "White-label options",
        "Advanced analytics",
        "API access",
      ],
      popular: false,
    },
  ]

  const techSpecs = [
    {
      category: "Video Quality",
      specs: [
        { name: "Max Resolution", value: "4K (3840x2160)" },
        { name: "Frame Rate", value: "Up to 60 FPS" },
        { name: "Bitrate", value: "Up to 50 Mbps" },
        { name: "Codecs", value: "H.264, H.265, VP9" },
      ],
    },
    {
      category: "Audio Quality",
      specs: [
        { name: "Sample Rate", value: "48 kHz" },
        { name: "Bit Depth", value: "24-bit" },
        { name: "Channels", value: "Stereo/Mono" },
        { name: "Codecs", value: "AAC, MP3, Opus" },
      ],
    },
    {
      category: "Latency",
      specs: [
        { name: "Ultra-Low Latency", value: "< 1 second" },
        { name: "Low Latency", value: "2-5 seconds" },
        { name: "Standard", value: "10-30 seconds" },
        { name: "Adaptive", value: "Auto-optimized" },
      ],
    },
    {
      category: "System Requirements",
      specs: [
        { name: "CPU", value: "Intel i5 / AMD Ryzen 5" },
        { name: "RAM", value: "8GB minimum" },
        { name: "GPU", value: "GTX 1060 / RX 580" },
        { name: "Upload Speed", value: "5 Mbps minimum" },
      ],
    },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              Professional Live Streaming
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Stream to multiple platforms simultaneously with AI-powered enhancement, professional tools, and real-time
              analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Start Streaming <Play className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {streamingStats.map((stat, index) => (
              <Card key={index} className="text-center border border-orange-100 dark:border-orange-900/20">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Streaming Features</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for professional live streaming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {streamingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">{feature.icon}</div>
                    <Badge variant={feature.status === "Available" ? "default" : "secondary"}>{feature.status}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Multi-Platform Support
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Stream to all major platforms simultaneously with optimized settings for each
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformSupport.map((platform, index) => (
              <Card
                key={index}
                className="text-center border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{platform.logo}</div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <Badge
                    variant={platform.status === "Full Support" ? "default" : "secondary"}
                    className="w-fit mx-auto"
                  >
                    {platform.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Professional-grade streaming with industry-leading technical capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techSpecs.map((category, index) => (
              <Card key={index} className="border border-orange-100 dark:border-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-lg text-center">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.specs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{spec.name}</span>
                        <span className="font-medium text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Streaming Plans</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your streaming needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border ${plan.popular ? "border-orange-500 shadow-lg" : "border-orange-100 dark:border-orange-900/20"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Go Live?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators streaming with RunAsh's professional platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
