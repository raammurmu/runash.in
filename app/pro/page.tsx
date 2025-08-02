import type { Metadata } from "next"
import { Crown, Shield, BarChart3, Check, ArrowRight, Sparkles, Video, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "RunAsh Pro | Professional Streaming Platform",
  description:
    "Unlock professional streaming features with RunAsh Pro. Advanced analytics, priority support, and exclusive tools for serious creators.",
}

export default function ProPage() {
  const proFeatures = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into your audience, engagement patterns, and growth metrics",
      details: ["Real-time viewer analytics", "Engagement heatmaps", "Revenue tracking", "Custom reports"],
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Priority Support",
      description: "24/7 dedicated support with faster response times and direct access to experts",
      details: ["< 1 hour response time", "Dedicated account manager", "Phone support", "Priority bug fixes"],
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Professional Streaming",
      description: "Unlimited streaming hours, higher quality, and advanced broadcasting features",
      details: ["4K streaming", "Unlimited duration", "Multi-camera support", "Custom RTMP"],
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Tools",
      description: "Exclusive AI features for content optimization and audience engagement",
      details: ["AI content suggestions", "Auto-highlight creation", "Smart scheduling", "Audience insights"],
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Platform Pro",
      description: "Stream to unlimited platforms simultaneously with advanced customization",
      details: ["Unlimited platforms", "Platform-specific optimization", "Custom overlays", "Automated posting"],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enhanced Security",
      description: "Advanced security features and content protection for professional use",
      details: ["Content encryption", "Advanced moderation", "IP whitelisting", "Backup streaming"],
    },
  ]

  const pricingPlans = [
    {
      name: "Pro Monthly",
      price: "$29",
      period: "/month",
      description: "Perfect for growing creators",
      features: [
        "All Pro features included",
        "Advanced analytics dashboard",
        "Priority support (24/7)",
        "4K streaming quality",
        "Unlimited streaming hours",
        "Multi-platform streaming",
        "AI-powered tools",
        "Custom branding",
        "Advanced moderation",
        "API access",
      ],
      popular: false,
      cta: "Start Pro Monthly",
    },
    {
      name: "Pro Annual",
      price: "$290",
      period: "/year",
      originalPrice: "$348",
      savings: "Save $58",
      description: "Best value for serious creators",
      features: [
        "All Pro Monthly features",
        "2 months free",
        "Priority feature requests",
        "Exclusive beta access",
        "Advanced integrations",
        "Custom analytics reports",
        "Dedicated account manager",
        "White-label options",
        "Advanced API limits",
        "Training sessions",
      ],
      popular: true,
      cta: "Start Pro Annual",
    },
  ]

  const successStories = [
    {
      name: "Sarah Chen",
      role: "Gaming Streamer",
      avatar: "/placeholder.svg?height=60&width=60",
      growth: "300% viewer increase",
      quote: "RunAsh Pro's analytics helped me understand my audience better and triple my viewership in 3 months.",
      metrics: {
        before: "2.5K avg viewers",
        after: "7.8K avg viewers",
        timeframe: "3 months",
      },
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Educator",
      avatar: "/placeholder.svg?height=60&width=60",
      growth: "500% revenue growth",
      quote: "The multi-platform streaming and AI tools transformed my content strategy completely.",
      metrics: {
        before: "$1.2K/month",
        after: "$6.8K/month",
        timeframe: "6 months",
      },
    },
    {
      name: "Emma Thompson",
      role: "Lifestyle Creator",
      avatar: "/placeholder.svg?height=60&width=60",
      growth: "250% engagement boost",
      quote: "Priority support and advanced features gave me the confidence to go full-time streaming.",
      metrics: {
        before: "15% engagement",
        after: "38% engagement",
        timeframe: "4 months",
      },
    },
  ]

  const comparisonFeatures = [
    {
      category: "Streaming",
      features: [
        { name: "Streaming Hours", free: "10 hours/month", pro: "Unlimited" },
        { name: "Video Quality", free: "Up to 1080p", pro: "Up to 4K" },
        { name: "Simultaneous Platforms", free: "3 platforms", pro: "Unlimited" },
        { name: "Custom RTMP", free: "❌", pro: "✅" },
        { name: "Multi-camera Support", free: "❌", pro: "✅" },
      ],
    },
    {
      category: "Analytics",
      features: [
        { name: "Basic Analytics", free: "✅", pro: "✅" },
        { name: "Advanced Analytics", free: "❌", pro: "✅" },
        { name: "Real-time Metrics", free: "❌", pro: "✅" },
        { name: "Custom Reports", free: "❌", pro: "✅" },
        { name: "Data Export", free: "❌", pro: "✅" },
      ],
    },
    {
      category: "Support",
      features: [
        { name: "Community Support", free: "✅", pro: "✅" },
        { name: "Email Support", free: "48h response", pro: "1h response" },
        { name: "Phone Support", free: "❌", pro: "✅" },
        { name: "Dedicated Manager", free: "❌", pro: "✅" },
        { name: "Priority Bug Fixes", free: "❌", pro: "✅" },
      ],
    },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              RunAsh Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Unlock professional streaming features, advanced analytics, and priority support for serious creators
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Start Free Trial <Crown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                Compare Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Pro Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Professional Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to take your streaming to the next level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 w-fit mb-4">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Flexible pricing options for creators at every stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border hover:shadow-lg transition-shadow relative ${
                  plan.popular
                    ? "border-orange-500 dark:border-orange-400 shadow-lg"
                    : "border-orange-100 dark:border-orange-900/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                      <Badge variant="secondary" className="text-green-600">
                        {plan.savings}
                      </Badge>
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Free vs Pro Comparison
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See exactly what you get with RunAsh Pro
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="streaming" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="streaming">Streaming</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              {comparisonFeatures.map((category) => (
                <TabsContent key={category.category} value={category.category.toLowerCase()} className="mt-6">
                  <Card className="border border-orange-100 dark:border-orange-900/20">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left p-4 font-semibold">Feature</th>
                              <th className="text-center p-4 font-semibold">Free</th>
                              <th className="text-center p-4 font-semibold bg-orange-50 dark:bg-orange-900/20">Pro</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.features.map((feature, index) => (
                              <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                                <td className="p-4 font-medium">{feature.name}</td>
                                <td className="p-4 text-center text-gray-600 dark:text-gray-400">{feature.free}</td>
                                <td className="p-4 text-center bg-orange-50 dark:bg-orange-900/20 font-medium">
                                  {feature.pro}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how RunAsh Pro helped creators achieve their goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold">{story.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{story.role}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {story.growth}
                    </Badge>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{story.quote}"</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Before</div>
                      <div className="font-semibold">{story.metrics.before}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">After</div>
                      <div className="font-semibold text-green-600">{story.metrics.after}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">in {story.metrics.timeframe}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Go Pro?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've upgraded their streaming with RunAsh Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start 14-Day Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Contact Sales
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>
    </main>
  )
}
