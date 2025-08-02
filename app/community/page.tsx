import type { Metadata } from "next"
import {
  Users,
  Calendar,
  Award,
  Globe,
  ArrowRight,
  UserPlus,
  Zap,
  Target,
  Trophy,
  BookOpen,
  Video,
  Mic,
  Camera,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: "Community | RunAsh Platform",
  description: "Join the RunAsh community of creators, streamers, and innovators. Connect, learn, and grow together.",
}

export default function CommunityPage() {
  const communityStats = [
    { label: "Active Members", value: "50,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Countries", value: "120+", icon: <Globe className="h-5 w-5" /> },
    { label: "Monthly Events", value: "200+", icon: <Calendar className="h-5 w-5" /> },
    { label: "Success Stories", value: "5,000+", icon: <Award className="h-5 w-5" /> },
  ]

  const communityPrograms = [
    {
      title: "Creator Mentorship",
      description: "Get paired with experienced streamers for personalized guidance",
      icon: <UserPlus className="h-8 w-8" />,
      participants: "2,500+",
      color: "from-blue-500 to-cyan-500",
      features: ["1-on-1 Sessions", "Growth Strategies", "Technical Support", "Community Access"],
    },
    {
      title: "Innovation Labs",
      description: "Collaborate on cutting-edge streaming technology and AI features",
      icon: <Zap className="h-8 w-8" />,
      participants: "800+",
      color: "from-purple-500 to-pink-500",
      features: ["Beta Testing", "Feature Development", "Technical Workshops", "Direct Feedback"],
    },
    {
      title: "Content Challenges",
      description: "Monthly themed challenges with prizes and community recognition",
      icon: <Target className="h-8 w-8" />,
      participants: "15,000+",
      color: "from-green-500 to-emerald-500",
      features: ["Monthly Themes", "Prize Pool", "Community Voting", "Skill Building"],
    },
    {
      title: "Success Circle",
      description: "Exclusive network for top-performing creators and industry leaders",
      icon: <Trophy className="h-8 w-8" />,
      participants: "500+",
      color: "from-orange-500 to-yellow-500",
      features: ["Exclusive Events", "Industry Insights", "Partnership Opportunities", "Advanced Resources"],
    },
  ]

  const upcomingEvents = [
    {
      title: "AI Streaming Workshop",
      date: "March 15, 2024",
      time: "2:00 PM PST",
      type: "Workshop",
      attendees: 450,
      maxAttendees: 500,
      speaker: "Dr. Sarah Chen",
      speakerRole: "AI Research Lead",
      description: "Learn how to leverage AI for better streaming experiences",
      tags: ["AI", "Workshop", "Technical"],
    },
    {
      title: "Creator Showcase Live",
      date: "March 18, 2024",
      time: "6:00 PM PST",
      type: "Showcase",
      attendees: 1200,
      maxAttendees: 1500,
      speaker: "Community Team",
      speakerRole: "RunAsh",
      description: "Monthly showcase featuring top community creators",
      tags: ["Showcase", "Live", "Community"],
    },
    {
      title: "Multi-Platform Strategy Session",
      date: "March 22, 2024",
      time: "11:00 AM PST",
      type: "Strategy",
      attendees: 320,
      maxAttendees: 400,
      speaker: "Mike Rodriguez",
      speakerRole: "Growth Expert",
      description: "Master the art of streaming across multiple platforms",
      tags: ["Strategy", "Growth", "Multi-platform"],
    },
  ]

  const featuredMembers = [
    {
      name: "Alex StreamMaster",
      role: "Content Creator",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "125K",
      specialty: "Gaming & Tech",
      achievement: "Top Creator 2024",
      quote: "RunAsh community helped me grow from 100 to 125K followers in just 8 months!",
    },
    {
      name: "Maria TechTalks",
      role: "Tech Educator",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "89K",
      specialty: "AI & Innovation",
      achievement: "Innovation Award",
      quote: "The mentorship program connected me with amazing people who changed my career.",
    },
    {
      name: "David LiveCook",
      role: "Culinary Streamer",
      avatar: "/placeholder.svg?height=60&width=60",
      followers: "67K",
      specialty: "Cooking & Lifestyle",
      achievement: "Community Choice",
      quote: "From hobby to full-time career - the community support has been incredible.",
    },
  ]

  const communityResources = [
    {
      title: "Creator Handbook",
      description: "Complete guide to successful streaming",
      icon: <BookOpen className="h-6 w-6" />,
      downloads: "25K+",
      type: "Guide",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      icon: <Video className="h-6 w-6" />,
      downloads: "50K+",
      type: "Video",
    },
    {
      title: "Podcast Series",
      description: "Weekly interviews with successful creators",
      icon: <Mic className="h-6 w-6" />,
      downloads: "30K+",
      type: "Audio",
    },
    {
      title: "Live Workshops",
      description: "Interactive sessions with industry experts",
      icon: <Camera className="h-6 w-6" />,
      downloads: "15K+",
      type: "Live",
    },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text mb-6">
              Join Our Community
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mb-8">
              Connect with creators worldwide, learn from experts, and grow your streaming journey together
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white">
                Join Community <Users className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
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

      {/* Community Programs */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Programs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join specialized programs designed to accelerate your growth and connect you with like-minded creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {communityPrograms.map((program, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${program.color}`}>
                      <div className="text-white">{program.icon}</div>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {program.participants} participants
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{program.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join live workshops, showcases, and networking events with the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{event.date}</div>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{event.speaker[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{event.speaker}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{event.speakerRole}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Attendees</span>
                      <span>
                        {event.attendees}/{event.maxAttendees}
                      </span>
                    </div>
                    <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Community Members
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet some of our amazing community members who are making waves in the streaming world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMembers.map((member, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow text-center"
              >
                <CardContent className="p-6">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>

                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{member.role}</p>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{member.followers}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {member.achievement}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4">"{member.quote}"</p>

                  <Badge variant="outline" className="text-xs">
                    {member.specialty}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Resources */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Resources</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access free resources created by and for the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityResources.map((resource, index) => (
              <Card
                key={index}
                className="border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-shadow text-center"
              >
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 w-fit mx-auto mb-4">
                    <div className="text-white">{resource.icon}</div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{resource.downloads}</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Access Resource
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with 50,000+ creators, access exclusive resources, and accelerate your streaming journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Join Now - It's Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
